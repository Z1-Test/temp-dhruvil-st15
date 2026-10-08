---
type: Journey
title: "Financial Planner Mortgage & Amortization Comparison Journey"
status: draft
description: "Human story, beat-by-beat narrative, emotion signals, and friction interventions for mortgage EMI planning and amortization exploration."
tags: [journey, user-journey, financial, loan, amortization, okf-v0.2]
sources:
  - resource: ../../project/vision.md
  - resource: ../../project/actors.md
---

# User Journey: Financial Planner Mortgage & Amortization Comparison

- **Surface**: `app`
- **Primary Actor**: `ACT-USER-FIN` (Financial Planner / Homeowner)
- **User Goal**: Compare mortgage options across different interest rates and tenures, review the principal vs interest breakdown, and export the complete 30-year amortization schedule to CSV.

## 1. Slices in Sequence
1. `features/app/financial/compute-loan-interest/` — Enter loan parameters, compute monthly EMI, inspect interactive donut breakdown, and view amortization schedule.
2. `features/app/history/manage-calculation-tape/` — Save loan summary and export table.

## 2. Beat Matrix (Story & Experience)

| Beat ID | Slice | Action & Context | User Emotion | Friction & Risk | System Intervention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BEAT-FIN-01` | `financial/compute-loan-interest` | Enters Principal `$350,000`, Rate `6.5%`, Tenure `30 Years` | 😀 Confident | Slow manual calculation | Instant KPI update: Monthly EMI `$2,212.24` |
| `BEAT-FIN-02` | `financial/compute-loan-interest` | Inspects Total Payment & Interest | 😐 Expectant | Shock at total interest ($$446,407) | Donut chart visually displays 56% interest vs 44% principal |
| `BEAT-FIN-03` | `financial/compute-loan-interest` | Clicks "Amortization Table" | 😀 Delighted | Page freezes on 360 rows | Virtualized table renders in $<10$ms |
| `BEAT-FIN-04` | `financial/compute-loan-interest` | Clicks "Export CSV" to prepare client report | 😀 Delighted | Formatting hassle | Instant file download with month-by-month principal and balance breakdown |

## 3. Friction & Solutions (`FRC-*`)

| ID | Type | Impact × Frequency | Fix |
| :--- | :--- | :--- | :--- |
| `FRC-FIN-01` | Delays | Major Improvement | Virtual table scrolling guarantees zero DOM freeze across 360–480 monthly installment rows. |
| `FRC-FIN-02` | Poor Feedback | Quick Win | Dual input format allows tenure entry in either Years (e.g. 30) or Months (e.g. 360). |

## 4. References
- [Compute Financial Loans & Amortization](../../features/app/financial/compute-loan-interest/feature.md)
- [Manage Calculation Tape](../../features/app/history/manage-calculation-tape/feature.md)
