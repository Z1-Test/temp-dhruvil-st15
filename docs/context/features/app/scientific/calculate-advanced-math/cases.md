---
type: Test Cases
title: "Calculate Advanced Scientific Functions Test Cases & Scenarios"
status: planning_ready
description: "Unified test scenarios, domain limits, angle mode accuracy, and traceability for Scientific Mode."
tags: [cases, test-cases, scientific, trigonometry, math, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Calculate Advanced Scientific Functions

Authoritative test scenarios for scientific calculations, transcendental domains, and angle units.

## 1. Scenario Specifications

### `CASE-SCI-01`: Happy Path Trigonometric Evaluation (DEG vs RAD)
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Calculator in Scientific Mode, `DEG` mode active.
- **Action Sequence / Input**: User types `sin(30)`, then presses `=`.
- **Expected Outcome**: Result equals exactly `0.5`. User toggles mode to `RAD` with expression `sin(π / 2)`; result equals `1`. Visual badge clearly states active unit (`DEG` vs `RAD`).
- **Enforces**: `RULE-SCI-01`, `NEVER-SCI-01`

### `CASE-SCI-02`: Real-Domain Fencing on Negative Square Root
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Real mode active.
- **Action Sequence / Input**: User inputs `sqrt(-16)`.
- **Expected Outcome**: Preview line displays `Domain Error: Negative root undefined in real mode`. Pressing `=` does not crash application.
- **Enforces**: `RULE-SCI-02`

### `CASE-SCI-03`: Large Factorial Evaluation ($n!$)
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Standard input buffer.
- **Action Sequence / Input**: User inputs `10!`, then presses `=`.
- **Expected Outcome**: Evaluates to `3628800`. User inputs `100!`; evaluates in sub-5ms returning full scientific representation `9.332621544394415e+157`.
- **Enforces**: `RULE-SCI-03`, `NEVER-SCI-02`

### `CASE-SCI-04`: Transcendental Precision with Euler's Number & Natural Log
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Scientific mode active.
- **Action Sequence / Input**: User inputs `ln(e^3)`, then presses `=`.
- **Expected Outcome**: Result simplifies and evaluates to exactly `3`.
- **Enforces**: `RULE-SCI-01`

### `CASE-SCI-05`: Combinations and Permutations
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Display ready.
- **Action Sequence / Input**: User inputs `10 nCr 3`, then presses `=`.
- **Expected Outcome**: Evaluates $\frac{10!}{3!(10-3)!} = 120$.
- **Enforces**: `RULE-SCI-03`

### `CASE-SCI-06`: Transcendental Constants High-Precision Expansion
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Display ready.
- **Action Sequence / Input**: User presses constant button `π`, then presses `=`.
- **Expected Outcome**: Evaluates to $\pi$ with full 34+ decimal place precision (`3.14159265358979323846264338327950288...`).
- **Enforces**: `RULE-SCI-04`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-SCI-01` | `DEC-SCI-01` | `CASE-SCI-01` | Angle Modes | `tests/unit/scientific-trig.test.ts` |
| `NEVER-SCI-01` | `DEC-SCI-01` | `CASE-SCI-01` | Angle UI Sync | `tests/unit/scientific-trig.test.ts` |
| `RULE-SCI-02` | `DEC-SCI-02` | `CASE-SCI-02` | Domain Errors | `tests/unit/scientific-domains.test.ts` |
| `RULE-SCI-03` | `DEC-SCI-02` | `CASE-SCI-03` | Combinatorics | `tests/unit/scientific-factorials.test.ts` |
| `NEVER-SCI-02` | `DEC-SCI-02` | `CASE-SCI-03` | Performance | `tests/unit/scientific-factorials.test.ts` |
| `RULE-SCI-01` | `DEC-SCI-03` | `CASE-SCI-04` | Logarithms | `tests/unit/scientific-logs.test.ts` |
| `RULE-SCI-04` | `DEC-SCI-02` | `CASE-SCI-06` | Constant Precision | `tests/unit/scientific-constants.test.ts` |

## 3. Cases N/A Declarations
- **Bulk / Batch Operations**: N/A (Standard single-formula execution; matrix/array math is separate).
- **Late Webhook Replay**: N/A (Client-side math execution).

## 4. Unhandled Stall Checklist
- [x] Heavy factorials ($n!$) execute with bounded loop and do not lock UI.
- [x] Negative roots and out-of-domain logarithms fail gracefully with descriptive error text.
- [x] Angle unit transitions immediately reflect in the active preview calculation.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
