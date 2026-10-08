---
type: Conventions
title: "Universal Calculator Engineering Conventions"
description: "Repository organization, mathematical verification test standards, error handling patterns, and code conventions for the Universal Calculator."
status: stable
tags: [conventions, standards, testing, quality]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/architecture.md
---

# Universal Calculator Engineering Conventions

## 1. Directory & Code Organization

Regardless of the eventual UI framework chosen, the codebase must enforce strict separation between mathematical calculation logic and presentation views:

```text
src/
├── core/                       # Pure mathematical domain (100% UI-free)
│   ├── lexer/                  # Tokenizer & lexical analyzer
│   ├── parser/                 # Shunting-yard AST & RPN generator
│   ├── evaluators/             # Domain engines (Standard, Scientific, Programmer, Financial, Units)
│   ├── decimal/                # Arbitrary-precision decimal wrappers
│   └── types/                  # Pure math domain contracts & tokens
├── state/                      # Application state & stores
│   ├── calculator-machine.ts   # Active expression, cursor, current mode
│   ├── memory-store.ts         # M+, M-, MR, MC registers
│   └── history-store.ts        # IndexedDB / local persistence for tape
├── ui/                         # Presentation & View Adapters
│   ├── components/             # Reusable UI elements (Display, Keypad, Tape, ModeSwitch)
│   ├── modes/                  # Surface layouts (Standard, Scientific, Programmer, Financial, Grapher)
│   └── styles/                 # CSS tokens, theme definitions (dark/light/OLED)
└── tests/                      # Verification test suites
    ├── unit/                   # Math accuracy & AST parsing tests
    ├── vectors/                # Standardized mathematical test vectors
    └── a11y/                   # Keyboard navigation and screen reader audits
```

---

## 2. Mathematical Verification & Testing Standards

Every calculation routine must pass three tiers of automated verification:

1. **Standardized Test Vectors (`tests/vectors/`)**:
   - Comprehensive test suites comparing results against certified reference values (e.g. NIST mathematical tables).
   - High-precision decimal tests verifying exact results for edge cases: `0.1 + 0.2`, `1 / 3`, $10^{30} + 1$, negative zero handling (`-0`).
2. **Property-Based & Fuzz Testing**:
   - Random mathematical expression generators fuzzing the parser to ensure it **never throws unhandled exceptions** or enters infinite loops on arbitrary token sequences.
   - Algebraic identity invariants:
     - Addition associativity: $(a + b) + c == a + (b + c)$
     - Multiplication commutativity: $a \cdot b == b \cdot a$
     - Inverse functions: $\arcsin(\sin(x)) == x$ for $x \in [-\pi/2, \pi/2]$.
3. **Accessibility & WCAG Verification**:
   - Automated testing with axe-core / Playwright for WCAG 2.2 AA compliance.
   - Verification that all interactive keypad buttons possess unambiguous `aria-label`, visible focus rings, and proper keyboard activation triggers (`Enter` / `Space`).

---

## 3. Error Handling Contract

The calculation engine must never return raw runtime exceptions to the UI. All evaluations return a structured `CalculationResult`:

```typescript
export type CalculationResult =
  | { success: true; value: string; formatted: string }
  | { success: false; error: CalculationError };

export interface CalculationError {
  code:
    | "DIVIDE_BY_ZERO"
    | "SYNTAX_ERROR"
    | "DOMAIN_ERROR"
    | "OVERFLOW"
    | "UNCLOSED_PARENTHESES";
  message: string;
  position?: number;
}
```
