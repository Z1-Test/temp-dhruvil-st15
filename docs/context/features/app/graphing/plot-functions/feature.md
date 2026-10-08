---
type: Feature
title: "Plot 2D Mathematical Functions & Graph Analysis"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for 2D Graphing Mode."
tags: [feature, graphing, plot, functions, math, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Plot 2D Mathematical Functions & Graph Analysis

Authoritative product specification for 2D Cartesian function plotting, multi-curve overlays, viewport pan/zoom, interactive coordinate tracing, root finding, and singularity handling.

## 1. Problem, Actors & Outcome
- **Problem & Context**: STEM students, engineers, and educators need to visualize mathematical curves (polynomials, trigonometric waves, rational functions) to understand behavior, intercepts, and roots. Traditional standalone graphing calculators are bulky, slow, or exhibit visual glitches near asymptotes.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-STEM` | `app/graphing` | Analyzing calculus, algebra, or wave equations | Full function graphing |
- **Checkable Success ("This Worked")**: Typing $f(x) = \sin(x)$ or $f(x) = x^2 - 4$ renders smooth curves at 60 FPS; user can pan and zoom the Cartesian plane; hovering over curve displays precise $(x, y)$ coordinates; roots ($x$-intercepts) and local extrema are highlighted.
- **Checkable Failure ("This Is Broken")**: Curve rendering blocks user typing; vertical artifact lines drawn across vertical asymptotes (e.g. $\tan(x)$ or $1/x$); extreme zoom levels crash browser canvas.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - 2D Cartesian Function Plotting: Support for $y = f(x)$ with variables, powers, fractions, and trigonometric functions.
  - Multi-Curve Overlays: Plot up to 4 functions simultaneously with distinct contrasting color tokens.
  - Interactive Viewport:
    - Pan by dragging.
    - Zoom via scroll wheel or pinch-to-zoom gestures.
    - "Home" button to reset view to $x \in [-10, 10], y \in [-10, 10]$.
  - Curve Trace Cursor: Displays floating tooltip with $(x, y)$ coordinates as user scrubs along the curve.
  - Critical Points Detection: Automatic calculation and marker pins for $X$-intercepts (roots), $Y$-intercepts, and local minima/maxima.
  - Asymptote Protection: Prevents drawing vertical connecting segments across discontinuous poles (e.g. $1/x$ at $x=0$).
- **Refused / Owned Elsewhere**:
  - 3D surface rendering and implicit contour plots are out of scope for Phase 1.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-GRAPH-01`: Curve sampling must dynamically evaluate across visible screen pixels (typically 1,000–2,000 discrete $x$ points across canvas width).
  - `RULE-GRAPH-02`: Asymptote detection: If $|f(x_i) - f(x_{i-1})|$ exceeds a steep gradient threshold and sign inverts across zero, the line segment between samples must be skipped (lift pen).
  - `RULE-GRAPH-03`: Undefined regions (e.g. $\sqrt{x}$ where $x < 0$) must not render canvas lines.
  - `RULE-GRAPH-04`: Viewport changes must debounce expensive numerical root-finding algorithms to maintain 60 FPS rendering.
- **What Must Never Happen**:
  - `NEVER-GRAPH-01`: Never block the main UI thread during mathematical curve rendering.
  - `NEVER-GRAPH-02`: Never render false artifact vertical lines connecting positive and negative infinities across vertical asymptotes.

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PlottedFunctions` | Array of formula strings | Committed | Yes (LocalStorage) | Yes | Last-write |
| `ViewportState` | Coordinates `{ xMin, xMax, yMin, yMax }` | Ephemeral | Yes (LocalStorage) | Yes | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Badge displays coordinate readout when hovering over curve.
- **Audit Logging**: Formulas saved in local history state.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-GRAPH-01` | `scientific/calculate-advanced-math` | `graphing/plot-functions` | `{ expressionFormula }` | Graph plotted curve | destination | `RULE-GRAPH-01` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
