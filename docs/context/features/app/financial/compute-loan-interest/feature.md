---
type: Feature
title: "Compute Financial Loans, Amortization & TVM Calculations"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for Financial Mode."
tags: [feature, financial, loan, amortization, tvm, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Compute Financial Loans, Amortization & TVM Calculations

Authoritative product specification for mortgage & EMI loan calculation, full amortization table generation, simple & compound interest, Time Value of Money (TVM), and commercial business formulas (tax, margin, discount, tip split).

## 1. Problem, Actors & Outcome
- **Problem & Context**: Consumers evaluating home loans, car financing, or investment compounding struggle with complex algebraic formulas. Traditional calculators lack dedicated financial parameters, forcing users to assemble brittle multi-step formulas prone to order-of-operation errors.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-FIN` | `app/financial` | Evaluating loan offers, tax bills, or investments | Full financial modeling |
- **Checkable Success ("This Worked")**: Entering Principal, Interest Rate, and Tenure outputs exact monthly EMI down to the nearest cent; generates a responsive year-by-year and month-by-month amortization schedule; TVM solver solves for any single unknown variable (`PV`, `FV`, `PMT`, `N`, `I/Y`).
- **Checkable Failure ("This Is Broken")**: Accumulated cent-rounding drift across 360 payments causing loan balance mismatch; negative tenure or divide-by-zero crashes.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - Loan & Mortgage EMI: Principal ($P$), Annual Rate ($r$), Tenure in months or years ($n$), calculating periodic installment ($E = P \cdot \frac{r(1+r)^n}{(1+r)^n - 1}$).
  - Amortization Table: Month-by-month breakdown with Opening Balance, EMI, Principal Component, Interest Component, and Closing Balance.
  - Compound & Simple Interest: Principal, rate, compounding frequency (annually, semi-annually, quarterly, monthly, daily), total interest earned.
  - Time Value of Money (TVM): Solver for 5 interrelated financial parameters (`PV`, `FV`, `PMT`, `N`, `I/Y`).
  - Business & Commercial Tools:
    - Sales Tax / GST / VAT (Tax-inclusive and Tax-exclusive modes).
    - Profit Margin & Markup calculator.
    - Discount & Net Savings calculator.
    - Tip & Bill splitting calculator with guest head-count.
- **Refused / Owned Elsewhere**:
  - Live real-time currency forex exchange updates requiring cloud network synchronization are partitioned to an optional cached rates adapter.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-FIN-01`: Financial figures must round half up (`ROUND_HALF_UP`) to 2 decimal places for presentation currency units, while maintaining internal precision up to 34 decimal places during compounding.
  - `RULE-FIN-02`: In amortization schedules, the final monthly payment must adjust for cent-level fraction differences so the terminating balance equals exactly `$0.00`.
  - `RULE-FIN-03`: Zero-interest loans ($r = 0\%$) must evaluate gracefully as a pure linear installment ($E = P / n$) without division-by-zero errors.
  - `RULE-FIN-04`: Negative loan principal, negative interest rate, or tenure $< 1$ period are invalid inputs that reject calculation with explicit parameter warnings.
- **What Must Never Happen**:
  - `NEVER-FIN-01`: Never allow accumulated rounding errors to leave an unpaid residual debt balance at the conclusion of an amortization schedule.
  - `NEVER-FIN-02`: Never freeze the UI while rendering long amortization schedules (e.g. 360 or 480 payments).

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `LoanModel` | Ephemeral input form | Draft | Yes (LocalStorage) | Yes | Last-write |
| `AmortizationTable` | Computed array | Committed | Recomputed on demand | Recomputed | Pure computation |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Summary banner presenting total interest paid vs principal percentage.
- **Audit Logging**: Amortization schedules support one-click export to CSV and JSON formats.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-FIN-01` | `financial/compute-loan-interest` | `history/manage-calculation-tape` | `{ loanSummary, emi, totalInterest }` | Recorded tape entry | source | `RULE-FIN-01`, `RULE-FIN-02` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
