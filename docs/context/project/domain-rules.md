---
type: DomainRules
title: "Universal Calculator Domain Rules & Mathematical Invariants"
description: "Authoritative business rules, mathematical invariants, error contracts, and strict prohibitions for calculation evaluation."
status: stable
tags: [domain-rules, rules, invariants, math]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/vision.md
  - resource: docs/context/project/architecture.md
---

# Universal Calculator Domain Rules & Mathematical Invariants

## 1. Core Mathematical Invariants (`RULE-CALC-*`)

- `RULE-CALC-01`: **Zero Division Protection**:
  Division by zero ($x / 0$) and modulo by zero ($x \pmod 0$) must cleanly throw a structured mathematical exception (`Cannot divide by zero`). The engine must never propagate unhandled `Infinity`, `-Infinity`, or `NaN` into user displays.
- `RULE-CALC-02`: **Exact Decimal Arithmetic**:
  All standard, financial, and converter calculations must evaluate via an arbitrary-precision decimal engine with a minimum of 34 significant decimal places. Binary floating-point representation drift (e.g. $0.1 + 0.2 \ne 0.3$) is strictly prohibited.
- `RULE-CALC-03`: **BODMAS / PEMDAS Infix Precedence**:
  Expressions without explicit brackets must evaluate in strict algebraic order:
  1. Parentheses `(...)`
  2. Functions & Unary operators (`sin`, `cos`, `!`, `negate`)
  3. Exponents & Roots (`^`, `sqrt`)
  4. Multiplication & Division (`*`, `/`, `%`)
  5. Addition & Subtraction (`+`, `-`)
- `RULE-CALC-04`: **Parentheses Auto-Balancing**:
  If the user presses `=` or `Enter` with unclosed parentheses (e.g. `10 * (5 + 2`), the parser must automatically supply virtual trailing closing parentheses to evaluate the expression gracefully.
- `RULE-CALC-05`: **Contextual Percentage Logic**:
  - Direct percentage: `250 * 20% = 50`
  - Additive markup: `100 + 15% = 115`
  - Subtractive discount: `100 - 15% = 85`
  - Standalone percentage: `50% = 0.5`
- `RULE-CALC-06`: **Transcendental & Real Domain Fencing**:
  When real-mode is active:
  - $\sqrt{x}$ where $x < 0 \implies$ `Error: Negative root undefined in real mode`.
  - $\ln(x)$ or $\log_{10}(x)$ where $x \le 0 \implies$ `Error: Non-positive logarithm undefined`.
  - $\arcsin(x)$ or $\arccos(x)$ where $|x| > 1 \implies$ `Error: Domain [-1, 1] exceeded`.
- `RULE-CALC-07`: **Programmer Word Truncation & Sign Extension**:
  All bitwise operations, shifts, and arithmetic in Programmer Mode must immediately mask results to the active word width (BYTE: $0xFF$, WORD: $0xFFFF$, DWORD: $0xFFFFFFFF$, QWORD: $0xFFFFFFFFFFFFFFFF$) with correct Two's Complement sign extension.
- `RULE-CALC-08`: **Tape Audit Integrity**:
  Every committed calculation generates an immutable calculation tape entry with a UUID, timestamp, full expression string, and evaluated result.

---

## 2. Prohibitions & Anti-Patterns (`NEVER-CALC-*`)

- `NEVER-CALC-01`: **Never Crash on Invalid Syntax**:
  Malformed expressions (e.g. `5 ++ / 3` or `(5 + (2 * )`) must immediately render a friendly, inline syntax warning (`Invalid expression`) without crashing the application or discarding previous user input.
- `NEVER-CALC-02`: **Never Use Dynamic Code Execution**:
  The application must **NEVER** utilize `eval()`, `new Function()`, or dynamic scripting evaluation under any circumstances.
- `NEVER-CALC-03`: **Never Silently Discard Calculation History**:
  Calculation tape records and stored memory registers must survive page reloads, tab switches, and app backgrounding by persisting directly to IndexedDB / local storage.
- `NEVER-CALC-04`: **Never Freeze UI During Graph Sampling or Heavy Computations**:
  Calculations requiring iterative loops (e.g. amortization table generation or 2D curve plotting with thousands of samples) must never block the main thread; they must execute asynchronously or within web workers.
