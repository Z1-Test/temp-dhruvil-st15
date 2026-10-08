---
type: Journey
title: "STEM Researcher Scientific & Engineering Calculation Journey"
status: draft
description: "Human story, beat-by-beat narrative, emotion signals, friction interventions, and overlay lifecycle for scientific calculations and engineering analysis."
tags: [journey, user-journey, scientific, stem, trigonometry, experience, okf-v0.2]
sources:
  - resource: ../../project/vision.md
  - resource: ../../project/actors.md
---

# User Journey: STEM Researcher Scientific & Engineering Calculation

- **Surface**: `app`
- **Primary Actor**: `ACT-USER-STEM` (STEM Student & Engineering Researcher)
- **User Goal**: Solve multi-step physics and electrical engineering problems involving angular trigonometry, transcendental powers, logarithms, and scientific constants, verifying results with audit tape history.

## 1. Slices in Sequence
1. `features/app/scientific/calculate-advanced-math/` — Input transcendental formulas, toggle DEG/RAD angle modes, compute inverse functions, and insert constants ($\pi, e$).
2. `features/app/history/manage-calculation-tape/` — Inspect previous step values, copy intermediate results, and annotate formulas.

## 2. Beat Matrix (Story & Experience)

| Beat ID | Slice | Action & Context | User Emotion | Friction & Risk | System Intervention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BEAT-SCI-01` | `scientific/calculate-advanced-math` | Switches to Scientific mode, checks angle indicator (`DEG`), and enters `sin(45) * cos(45)` | 😀 Focused | Unsure if angle mode is active in calculations | Prominent live badge displays `DEG` with live preview value `0.5` |
| `BEAT-SCI-02` | `scientific/calculate-advanced-math` | Calculates wave phase using Radians by clicking `DEG` badge to cycle to `RAD`, then types `2 * π * 50 * 0.02` | 😀 Confident | Inadvertent degree calculation on angular frequency | Instant badge transition to `RAD` with live recalculated preview `6.283185...` |
| `BEAT-SCI-03` | `scientific/calculate-advanced-math` | Toggles `2nd` key layer and computes inverse tangent $\text{atan}(1)$ | 😀 Delighted | Button ambiguity between direct and inverse functions | Keypad labels dynamically flip (e.g. `sin` $\to$ `asin`, `ln` $\to$ `eˣ`, `x²` $\to$ `√x`) |
| `BEAT-SCI-04` | `scientific/calculate-advanced-math` | Inputs large permutation formula `50 nPr 5` | 😀 Impressed | UI lag or browser freeze on high combinatorial operations | Fast O(k) factorial cancellation evaluates sub-millisecond |
| `BEAT-SCI-05` | `history/manage-calculation-tape` | Opens History Drawer to review complete multi-step derivation and copies intermediate value | 😀 Delighted | Losing multi-line expression history | Persistent calculation tape preserves full expression, angle mode tag, and result |

## 3. Friction & Solutions (`FRC-*`)

| ID | Type | Impact × Frequency | Fix |
| :--- | :--- | :--- | :--- |
| `FRC-SCI-01` | Confusion | High × Medium | Persistent angle unit badge (`DEG` / `RAD` / `GRAD`) directly visible above keypad with single-click cycling. |
| `FRC-SCI-02` | Cognitive Load | High × High | `2nd` toggle changes physical button glyphs so users never guess inverse function shortcuts. |
| `FRC-SCI-03` | Calculation Error | High × High | Parentheses nesting counter and automatic closing brackets upon pressing `=`. |
| `FRC-SCI-04` | Domain Boundary | Medium × Low | Descriptive inline domain warnings (e.g. `Domain Error: ln(x) requires x > 0`) instead of generic crash or `NaN`. |

## 4. Overlay Lifecycle
| Overlay | Appear | Act | Dismiss | Fail |
| :--- | :--- | :--- | :--- | :--- |
| `ScientificFunctionsDrawer` | Click "Scientific / 2nd" toggle or rotate device to landscape. | Access hyperbolic functions (`sinh`, `cosh`, `tanh`), factorials, constants ($\pi, e, \phi$), and combinatorics ($nCr, nPr$). | Click compact toggle or rotate back to portrait. | Maintains active expression buffer uninterrupted across layout transitions. |
| `HistoryDrawer` | Tap tape icon in top toolbar. | View timestamped calculation stream tagged with `[DEG]` or `[RAD]`, copy result, or restore formula to editor. | Tap backdrop, press `Esc`, or tap close button. | Preserves active uncommitted formula in input buffer while browsing history. |

## 5. References
- [Calculate Advanced Scientific & Transcendental Functions](../../features/app/scientific/calculate-advanced-math/feature.md)
- [Manage Calculation Tape](../../features/app/history/manage-calculation-tape/feature.md)
