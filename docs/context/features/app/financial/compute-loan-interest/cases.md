---
type: Test Cases
title: "Compute Financial Loans & Amortization Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, cent-precision amortization verification, 12-stall matrix, and traceability for Financial Mode."
tags: [cases, test-cases, financial, loan, amortization, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Compute Financial Loans & Amortization

Authoritative test scenarios for financial loans, exact amortization schedules, compound interest, and business tax calculations.

## 1. Scenario Specifications

### `CASE-FIN-01`: Standard Mortgage EMI & Zero-Balance Amortization
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Loan form inputs: Principal = `$100,000`, Annual Rate = `6.0%`, Tenure = `360` months (30 years).
- **Action Sequence / Input**: User submits calculation and opens Amortization Schedule.
- **Expected Outcome**:
  - Monthly EMI evaluates to `$599.55`.
  - Total payment evaluates to `$215,838.19` (Total Interest: `$115,838.19`).
  - Month 360 closing balance equals exactly `$0.00` without cent deviation.
  - 360-row amortization table renders smoothly in under 15ms without UI freeze.
- **Enforces**: `RULE-FIN-01`, `RULE-FIN-02`, `NEVER-FIN-01`, `NEVER-FIN-02`

### `CASE-FIN-02`: Zero-Percent Interest Graceful Fallback
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Principal = `$12,000`, Annual Rate = `0.0%`, Tenure = `12` months.
- **Action Sequence / Input**: User submits calculation.
- **Expected Outcome**: Monthly installment evaluates to exactly `$1,000.00`; Total interest equals `$0.00`. No divide-by-zero exception is raised.
- **Enforces**: `RULE-FIN-03`

### `CASE-FIN-03`: Compound Interest with Compounding Frequencies
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Principal = `$10,000`, Annual Rate = `5%`, Time = `10` years, Compounding = Quarterly ($n = 4$).
- **Action Sequence / Input**: Submits compound interest calculation.
- **Expected Outcome**: Evaluates $10000 \cdot (1 + 0.05/4)^{40} = \$16,436.19$.
- **Enforces**: `RULE-FIN-01`

### `CASE-FIN-04`: Sales Tax Inclusive vs Exclusive
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Price = `$100`, Tax Rate = `10%`.
- **Action Sequence / Input**:
  - In Tax-Exclusive mode: Tax = `$10.00`, Total = `$110.00`.
  - In Tax-Inclusive mode: Base Price = `$90.91`, Tax = `$9.09`, Total = `$100.00`.
- **Expected Outcome**: Both modes compute exact rounded values.
- **Enforces**: `RULE-FIN-01`

### `CASE-FIN-05`: Tip & Bill Splitter with Head Count
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Bill = `$120.00`, Tip = `18%`, Guests = `4`.
- **Action Sequence / Input**: Submits bill split.
- **Expected Outcome**: Tip = `$21.60`, Total = `$141.60`, Per person = `$35.40`.
- **Enforces**: `RULE-FIN-01`

### `CASE-FIN-06`: Invalid Negative Input Boundary Rejection
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: Loan form inputs.
- **Action Sequence / Input**: User inputs Principal = `-$5,000` or Tenure = `0`.
- **Expected Outcome**: Field highlights with warning: `Principal must be greater than zero`; calculation does not execute.
- **Enforces**: `RULE-FIN-04`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-FIN-01` | `DEC-FIN-01` | `CASE-FIN-01` | Loan EMI | `tests/unit/financial-loan.test.ts` |
| `RULE-FIN-02` | `DEC-FIN-02` | `CASE-FIN-01` | Amortization Balance | `tests/unit/financial-amortization.test.ts` |
| `NEVER-FIN-01` | `DEC-FIN-02` | `CASE-FIN-01` | Residual Cent Drift | `tests/unit/financial-amortization.test.ts` |
| `NEVER-FIN-02` | `DEC-FIN-02` | `CASE-FIN-01` | Rendering Performance | `tests/unit/financial-amortization.test.ts` |
| `RULE-FIN-03` | `DEC-FIN-01` | `CASE-FIN-02` | Zero Rate Fallback | `tests/unit/financial-loan.test.ts` |
| `RULE-FIN-01` | `DEC-FIN-01` | `CASE-FIN-03` | Compound Interest | `tests/unit/financial-compound.test.ts` |
| `RULE-FIN-04` | `DEC-FIN-01` | `CASE-FIN-06` | Boundary Validation | `tests/unit/financial-loan.test.ts` |

## 3. Cases N/A Declarations
- **Late Webhook Replay**: N/A (Client-only calculation).
- **Undo / Reversal**: N/A (Pure input form; changing inputs re-computes state).

## 4. Unhandled Stall Checklist
- [x] Final payment in amortization schedule adjusts for accumulated fractional cents.
- [x] Zero-percent interest loan handles linear division cleanly.
- [x] Large 30-year amortization tables render with sub-20ms latency.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
