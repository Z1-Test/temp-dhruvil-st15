---
type: Flow
title: "Evaluate Standard Arithmetic User Flow"
status: draft
description: "User interaction logic, entry points, decision trees, recovery flows, and screen navigation for Standard Arithmetic."
tags: [flow, standard, arithmetic, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Evaluate Standard Arithmetic

Authoritative user interaction logic, keystroke handling, syntax validation, and live preview flow for Standard Arithmetic.

## 1. Flow Overview
- **Goal**: Enter numbers, operators, and parentheses to compute exact arithmetic calculations with live preview and tape persistence.
- **Primary Surface**: `app/standard`
- **Actor Role**: `ACT-USER-STD`
- **Entry Trigger**: App opens in standard mode or user switches mode selector to "Standard".
- **Exit Outcome**: Evaluated result displayed in main accumulator, expression preserved in history tape.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-STD-01` | Direct application launch | Fresh app launch or restored previous session | `SCR-STD-KEYPAD` | `FLW-STD-01` |
| `ENT-STD-02` | Mode selector switch | User clicked "Standard" from navigation bar | `SCR-STD-KEYPAD` | `FLW-STD-01` |

## 3. Step-by-Step Decision Logic (`FLW-STD-01`)

```text
START: [SCR-STD-KEYPAD: Display showing "0"]
  ↓
[User Action: Presses digit, decimal, operator, or parenthesis]
  ↓
DEC-STD-01: Is key an All-Clear (AC) or Backspace (⌫)?
  ├── AC → [Reset active buffer to "0", clear live preview]
  │         ↓
  │        EXIT: [SCR-STD-KEYPAD: Clean Display]
  │
  ├── ⌫  → [Remove trailing character/token from buffer]
  │         ↓
  │        (Re-evaluate expression preview)
  │
  └── Input Token (Digit / Operator / Bracket)
            ↓
       DEC-STD-02: Is input valid syntax token? (e.g. not consecutive dot)
            ├── NO  → (Ignore invalid input / No-op)
            └── YES → [Append token to expression buffer]
                        ↓
                   DEC-STD-03: Does expression contain divide-by-zero?
                        ├── YES → [Render inline warning: "Cannot divide by zero"]
                        │         [Dim "=" commit button]
                        └── NO  → [Compute Shunting-Yard AST preview]
                                  [Update bottom preview line with formatted result]
                                       ↓
                                  DEC-STD-04: User presses "=" or Enter?
                                       ├── NO  → (Awaiting further keystrokes)
                                       └── YES → DEC-STD-05: Are parentheses unclosed?
                                                   ├── YES → [Auto-balance with trailing ")"]
                                                   └── NO  → [Commit final calculation]
                                                                ↓
                                                             [Append to History Tape]
                                                             [Set accumulator to result]
                                                             EXIT: [Committed Display State]
```

## 4. Error Recovery & Stalls
- `REC-STD-01`: When division by zero is detected, the user presses backspace (`⌫`) or inputs a non-zero digit. The warning immediately clears and the live preview recalculates.
- `REC-STD-02`: When unclosed parentheses exist at `=` press, the parser supplies virtual closing brackets and computes without failing.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
