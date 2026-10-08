---
type: Test Cases
title: "Plot 2D Mathematical Functions Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, asymptote handling, trace accuracy, and traceability for 2D Graphing Mode."
tags: [cases, test-cases, graphing, plot, math, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Plot 2D Mathematical Functions

Authoritative test scenarios for 2D curve plotting, asymptote singularity protection, and coordinate tracing.

## 1. Scenario Specifications

### `CASE-GRAPH-01`: Standard Polynomial Curve Plotting & Root Detection
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Graphing canvas active with default bounds $[-10, 10]$.
- **Action Sequence / Input**: User enters $f(x) = x^2 - 4$.
- **Expected Outcome**:
  - Parabola renders centered on $y$-axis with minimum at $(0, -4)$.
  - Root marker pins appear on the $x$-axis at $(-2, 0)$ and $(2, 0)$.
  - $Y$-intercept marker pin appears at $(0, -4)$.
- **Enforces**: `RULE-GRAPH-01`

### `CASE-GRAPH-02`: Asymptote Singularity Protection ($1/x$)
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Canvas active.
- **Action Sequence / Input**: User enters $f(x) = 1 / x$.
- **Expected Outcome**:
  - Hyperbola renders in Quadrant 1 ($x > 0$) and Quadrant 3 ($x < 0$).
  - At $x = 0$, the line pen is lifted; no vertical artifact line connects $+\infty$ and $-\infty$.
- **Enforces**: `RULE-GRAPH-02`, `NEVER-GRAPH-02`

### `CASE-GRAPH-03`: Undefined Real Domain Fencing ($\sqrt{x}$)
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Real-mode graphing active.
- **Action Sequence / Input**: User enters $f(x) = \sqrt{x}$.
- **Expected Outcome**: Curve starts at $(0,0)$ and curves rightward into Quadrant 1 ($x \ge 0$). No points or lines are rendered for $x < 0$.
- **Enforces**: `RULE-GRAPH-03`

### `CASE-GRAPH-04`: Coordinate Trace Tooltip Accuracy
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Plotted function is $f(x) = \sin(x)$.
- **Action Sequence / Input**: User hovers cursor over $x \approx 1.57$ ($\pi/2$).
- **Expected Outcome**: Snapping marker snaps to curve peak; floating tooltip displays `x: 1.57, y: 1.00`.
- **Enforces**: `RULE-GRAPH-01`

### `CASE-GRAPH-05`: Viewport Pan and Zoom Continuity
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Plotted function on screen.
- **Action Sequence / Input**: User drags canvas rightward by 200px and zooms in by $2\times$.
- **Expected Outcome**: Grid dynamically rescales tick increments (e.g. from $2, 4, 6$ to $1, 2, 3$); curves resample without clipping.
- **Enforces**: `RULE-GRAPH-04`, `NEVER-GRAPH-01`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-GRAPH-01` | `DEC-GRAPH-02` | `CASE-GRAPH-01` | Polynomial Plot | `tests/unit/graphing-curves.test.ts` |
| `RULE-GRAPH-02` | `DEC-GRAPH-02` | `CASE-GRAPH-02` | Asymptote Guard | `tests/unit/graphing-asymptote.test.ts` |
| `NEVER-GRAPH-02` | `DEC-GRAPH-02` | `CASE-GRAPH-02` | Artifact Prevention | `tests/unit/graphing-asymptote.test.ts` |
| `RULE-GRAPH-03` | `DEC-GRAPH-02` | `CASE-GRAPH-03` | Domain Fencing | `tests/unit/graphing-domain.test.ts` |
| `RULE-GRAPH-01` | `DEC-GRAPH-02` | `CASE-GRAPH-04` | Coordinate Trace | `tests/unit/graphing-trace.test.ts` |

## 3. Cases N/A Declarations
- **Late Webhook Replay**: N/A (Client-only interactive canvas).
- **Undo / Reversal**: N/A (Interactive coordinate viewport).

## 4. Unhandled Stall Checklist
- [x] Vertical asymptotes lift drawing pen cleanly without vertical artifact streaks.
- [x] Complex or undefined domains omit rendering without error dialogs.
- [x] Viewport interactions maintain smooth 60 FPS frame rates.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
