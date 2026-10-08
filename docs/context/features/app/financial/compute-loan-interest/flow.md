---
type: Flow
title: "Compute Financial Loans & Amortization User Flow"
status: draft
description: "User interaction logic, parameter input, reactive EMI calculation, amortization breakdown, and TVM solver flow."
tags: [flow, financial, loan, amortization, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Compute Financial Loans & Amortization

Authoritative user interaction logic, parameter input, reactive recalculation, and amortization exploration for Financial Mode.

## 1. Flow Overview
- **Goal**: Calculate loan EMI, inspect amortization table, compute compound interest, and solve TVM variables.
- **Primary Surface**: `app/financial`
- **Actor Role**: `ACT-USER-FIN`
- **Entry Trigger**: User switches mode selector to "Financial" or selects "Loan / Mortgage".
- **Exit Outcome**: Monthly installment displayed, total interest breakdown visualized, full amortization table generated.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-FIN-01` | Mode dropdown select | User selects "Financial" | `SCR-FIN-WORKSPACE` | `FLW-FIN-01` |

## 3. Step-by-Step Decision Logic (`FLW-FIN-01`)

```text
START: [SCR-FIN-WORKSPACE: Form with Principal, Annual Rate %, Tenure fields]
  ↓
[User Action: Modifies Principal, Rate, or Tenure value]
  ↓
DEC-FIN-01: Are all required loan parameters valid positive numbers?
  ├── NO  → [Highlight offending field with red border & helper text]
  │         [Dim EMI summary card]
  │         EXIT: [Validation State]
  │
  └── YES → [Compute monthly installment (EMI)]
            [Compute total payment = EMI * tenure]
            [Compute total interest = total payment - Principal]
            [Update reactive KPI cards: Monthly EMI, Total Interest, Total Cost]
            [Render donut chart comparing Principal vs Interest proportion]
                 ↓
            DEC-FIN-02: Does user click "View Amortization Schedule"?
                 ├── NO  → (Summary view remains active)
                 └── YES → [Generate virtualized table of periodic payments]
                           [Render columns: Month #, EMI, Principal, Interest, Balance]
                           [Enable "Export CSV" and "Export PDF" buttons]
                           EXIT: [Amortization View]
```

## 4. Error Recovery & Stalls
- `REC-FIN-01`: If the user inputs `0%` interest, the engine activates linear division logic ($P / n$) immediately without triggering divide-by-zero errors.
- `REC-FIN-02`: For very long tenures (e.g. 40 years / 480 months), the amortization table uses virtual window rendering so DOM rendering takes $<10$ms with zero scroll lag.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
