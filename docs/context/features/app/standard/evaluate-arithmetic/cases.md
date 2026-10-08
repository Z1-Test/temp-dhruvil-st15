---
type: Test Cases
title: "Evaluate Standard Arithmetic Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, decimal precision verification, 12-stall matrix, and traceability for Standard Arithmetic."
tags: [cases, test-cases, standard, arithmetic, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Evaluate Standard Arithmetic

Authoritative test scenarios for standard four-function arithmetic, decimal accuracy, and live preview.

## 1. Scenario Specifications

### `CASE-STD-01`: Happy Path Multi-Operator Precedence
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Fresh calculator state with accumulator at "0".
- **Action Sequence / Input**: User types `15 + 6 * 4 - 10 / 2`, then presses `=`.
- **Expected Outcome**: Evaluates following BODMAS/PEMDAS: `6 * 4 = 24`, `10 / 2 = 5`, `15 + 24 - 5 = 34`. Accumulator updates to `34`; entry recorded in History Tape.
- **Enforces**: `RULE-STD-01`

### `CASE-STD-02`: High Precision Decimal Exactness (No Float Drift)
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Display ready.
- **Action Sequence / Input**: User types `0.1 + 0.2`, then presses `=`.
- **Expected Outcome**: Result displays exactly as `0.3` (not `0.30000000000000004`).
- **Enforces**: `RULE-STD-01`, `NEVER-STD-01`

### `CASE-STD-03`: Division by Zero Protection
- **Actor**: `ACT-USER-STD`
- **Preconditions**: User has typed `50 / 0`.
- **Action Sequence / Input**: Inspects live preview and attempts pressing `=`.
- **Expected Outcome**: Bottom line renders `Cannot divide by zero`. Pressing `=` is a no-op; app does not crash or display `Infinity` or `NaN`.
- **Enforces**: `RULE-STD-04`, `NEVER-STD-02`

### `CASE-STD-04`: Parentheses Auto-Balancing on Commit
- **Actor**: `ACT-USER-STD`
- **Preconditions**: User inputs unclosed bracket `10 * (4 + 6`.
- **Action Sequence / Input**: Presses `=`.
- **Expected Outcome**: Parser automatically supplies closing `)` and evaluates `10 * 10 = 100`.
- **Enforces**: `RULE-STD-01`, `NEVER-STD-02`

### `CASE-STD-05`: Additive Percentage Markup
- **Actor**: `ACT-USER-STD`
- **Preconditions**: User inputs `200 + 15%`.
- **Action Sequence / Input**: Presses `=`.
- **Expected Outcome**: Evaluates 15% of 200 ($30$) added to 200, resulting in `230`.
- **Enforces**: `RULE-STD-01`

### `CASE-STD-06`: Double Decimal Prevention
- **Actor**: `ACT-USER-STD`
- **Preconditions**: User has typed `12.5`.
- **Action Sequence / Input**: Types another `.` key.
- **Expected Outcome**: Key is ignored; display remains `12.5`.
- **Enforces**: `RULE-STD-03`

### `CASE-STD-07`: Consecutive Operator Replacement
- **Actor**: `ACT-USER-STD`
- **Preconditions**: User has typed `10 +`.
- **Action Sequence / Input**: User immediately presses `*`, followed by `5` and `=`.
- **Expected Outcome**: The `*` replaces the `+`; expression evaluates as `10 * 5 = 50`.
- **Enforces**: `RULE-STD-02`

### `CASE-STD-08`: Result Chaining on Next Operator
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Previous calculation evaluated to `50` upon `=`.
- **Action Sequence / Input**: User immediately presses `+`, followed by `10` and `=`.
- **Expected Outcome**: Evaluates `50 + 10 = 60`, automatically chaining previous result as first operand.
- **Enforces**: `RULE-STD-05`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-STD-01` | `DEC-STD-03` | `CASE-STD-01` | Unit / Precedence | `tests/unit/arithmetic.test.ts` |
| `NEVER-STD-01` | `DEC-STD-03` | `CASE-STD-02` | Unit / Precision | `tests/unit/decimal-precision.test.ts` |
| `RULE-STD-04` | `DEC-STD-03` | `CASE-STD-03` | Validation / Error | `tests/unit/division-by-zero.test.ts` |
| `NEVER-STD-02` | `DEC-STD-03` | `CASE-STD-03` | Resilience / Error | `tests/unit/division-by-zero.test.ts` |
| `RULE-STD-01` | `DEC-STD-05` | `CASE-STD-04` | Parser / Auto-Balance | `tests/unit/parser-parentheses.test.ts` |
| `RULE-STD-03` | `DEC-STD-02` | `CASE-STD-06` | Input Guard | `tests/unit/input-guards.test.ts` |
| `RULE-STD-02` | `DEC-STD-02` | `CASE-STD-07` | Operator Swap | `tests/unit/operator-chain.test.ts` |
| `RULE-STD-05` | `DEC-STD-04` | `CASE-STD-08` | Result Chaining | `tests/unit/result-chain.test.ts` |

## 3. Cases N/A Declarations
- **Bulk / Batch Operations**: N/A (Standard calculator operates on single active formula; batch array computation belongs to statistics module).
- **Undo / Immediate Reversal**: N/A (Handled via backspace key `⌫` and Clear Entry `CE`).
- **Late Webhook Replay**: N/A (Client-only computation engine with zero network webhooks).

## 4. Unhandled Stall Checklist
- [x] Division by zero provides immediate inline feedback without app crash.
- [x] Trailing operators or open brackets auto-balance gracefully on `=`.
- [x] All decimal calculations pass zero-drift precision test suites.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
