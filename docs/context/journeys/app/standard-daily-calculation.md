---
type: Journey
title: "Everyday Consumer Daily Calculation Journey"
status: draft
description: "Human story, beat-by-beat narrative, emotion signals, friction interventions, and overlay lifecycle for everyday standard math."
tags: [journey, user-journey, standard, experience, okf-v0.2]
sources:
  - resource: ../../project/vision.md
  - resource: ../../project/actors.md
---

# User Journey: Everyday Consumer Daily Calculation

- **Surface**: `app`
- **Primary Actor**: `ACT-USER-STD` (Everyday Consumer)
- **User Goal**: Calculate shopping totals with discounts and split the cost between roommates, reviewing the final receipt in the calculation tape.

## 1. Slices in Sequence
1. `features/app/standard/evaluate-arithmetic/` — Enter prices, operators, and percentages.
2. `features/app/history/manage-calculation-tape/` — Review past line items, annotate notes, and verify total.

## 2. Beat Matrix (Story & Experience)

| Beat ID | Slice | Action & Context | User Emotion | Friction & Risk | System Intervention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BEAT-STD-01` | `standard/evaluate-arithmetic` | Opens calculator and types item price `45.99 + 12.50` | 😀 Confident | Missing live total before `=` | Real-time bottom line shows preview `58.49` |
| `BEAT-STD-02` | `standard/evaluate-arithmetic` | Adds coupon discount `58.49 - 15%` | 😐 Expectant | Unclear whether 15% is off total or fixed | Displays evaluated deduction `49.71` |
| `BEAT-STD-03` | `standard/evaluate-arithmetic` | Divides by 2 roommates `/ 2` and presses `=` | 😀 Delighted | Rounding cent errors | Exact decimal evaluation `$24.86` per person |
| `BEAT-STD-04` | `history/manage-calculation-tape` | Expands History Tape and labels line "Groceries Split" | 😀 Delighted | Lost record on app close | Persists note directly to IndexedDB |

## 3. Friction & Solutions (`FRC-*`)

| ID | Type | Impact × Frequency | Fix |
| :--- | :--- | :--- | :--- |
| `FRC-STD-01` | Confusion | Quick Win | Dual-line display shows the active expression above the live result preview. |
| `FRC-STD-02` | Poor Feedback | Quick Win | Tactile button press feedback and clear syntax error badges. |
| `FRC-STD-03` | Technical Failure | Quick Win | IndexedDB auto-save guarantees no calculation is ever lost on accidental reload. |

## 4. Overlay Lifecycle
| Overlay | Appear | Act | Dismiss | Fail |
| :--- | :--- | :--- | :--- | :--- |
| `HistoryDrawer` | Clicks history icon in header; slides from right. | Tap past item, edit annotation note, export CSV. | Click outside backdrop, press `Esc`, or click close icon. | Retains uncommitted note in local state if closed mid-edit. |

## 5. References
- [Evaluate Standard Arithmetic](../../features/app/standard/evaluate-arithmetic/feature.md)
- [Manage Calculation Tape](../../features/app/history/manage-calculation-tape/feature.md)
