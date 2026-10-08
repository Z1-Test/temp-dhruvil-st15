---
type: Flow
title: "Calculate Advanced Scientific Functions User Flow"
status: planning_ready
description: "User interaction logic, angle toggling, secondary key switching, and formula evaluation for Scientific Mode."
tags: [flow, scientific, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Calculate Advanced Scientific Functions

Authoritative user interaction logic, key toggles, angle mode transitions, and scientific function evaluation.

## 1. Flow Overview
- **Goal**: Input advanced mathematical expressions using trigonometry, powers, roots, factorials, and constants.
- **Primary Surface**: `app/scientific`
- **Actor Role**: `ACT-USER-STEM`
- **Entry Trigger**: User switches mode selector to "Scientific" or expands scientific drawer.
- **Exit Outcome**: Evaluated result displayed with scientific precision, preserved in history tape.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-SCI-01` | Mode dropdown select | User clicks "Scientific Mode" | `SCR-SCI-KEYPAD` | `FLW-SCI-01` |
| `ENT-SCI-02` | Screen orientation change | Rotating mobile device from portrait to landscape | `SCR-SCI-KEYPAD` | `FLW-SCI-01` |

## 3. Step-by-Step Decision Logic (`FLW-SCI-01`)

```text
START: [SCR-SCI-KEYPAD: Display showing "0", Angle indicator "DEG"]
  ↓
[User Action: Presses key or toggles mode]
  ↓
DEC-SCI-01: Is key an Angle Mode toggle (DEG / RAD / GRAD)?
  ├── YES → [Cycle active angle mode: DEG → RAD → GRAD → DEG]
  │         [Update badge indicator on top bar]
  │         [Trigger live preview re-evaluation with new angle unit]
  │         EXIT: [Updated Angle State]
  │
  ├── 2nd Key → [Toggle 2nd function layer: sin ↔ asin, ln ↔ e^x, x^2 ↔ sqrt]
  │             [Update button labels visually on keypad]
  │             EXIT: [Toggled Keypad State]
  │
  └── Function / Number Input (e.g. "sin(", "π", "^")
            ↓
       DEC-SCI-02: Is function parameter within real domain?
            ├── NO  → (e.g. sqrt(-4) or ln(-1))
            │         [Render inline warning: "Domain Error: Input out of range"]
            │         [Dim "=" button]
            │
            └── YES → [Append function and opening parenthesis to expression buffer]
                        ↓
                   [Compute preview result]
                        ↓
                   DEC-SCI-03: User presses "="?
                        ├── NO  → (Awaiting additional operands/brackets)
                        └── YES → [Auto-balance open parentheses]
                                  [Commit result to accumulator]
                                  [Record entry into History Tape with Angle Mode tag]
                                  EXIT: [Committed Scientific State]
```

## 4. Error Recovery & Stalls
- `REC-SCI-01`: When a domain error is triggered (e.g. $\ln(0)$), pressing backspace `⌫` removes the invalid operand, restoring the valid preview immediately.
- `REC-SCI-02`: When the user notices an unexpected trig value (e.g. $\sin(90) = 0.8939$ because mode was in `RAD`), tapping the `DEG` button instantly re-evaluates the expression in degrees, displaying $\sin(90^\circ) = 1$.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
