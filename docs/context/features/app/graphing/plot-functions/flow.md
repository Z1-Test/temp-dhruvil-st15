---
type: Flow
title: "Plot 2D Mathematical Functions User Flow"
status: draft
description: "User interaction logic, formula input, viewport pan/zoom, curve tracing, and critical point inspection flow for 2D Graphing."
tags: [flow, graphing, plot, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Plot 2D Mathematical Functions

Authoritative user interaction logic, formula entry, canvas rendering, viewport interaction, and curve coordinate tracing.

## 1. Flow Overview
- **Goal**: Enter mathematical formulas $f(x)$, render responsive 2D Cartesian curves, pan/zoom viewports, and inspect coordinates/roots.
- **Primary Surface**: `app/graphing`
- **Actor Role**: `ACT-USER-STEM`
- **Entry Trigger**: User switches mode selector to "Graphing".
- **Exit Outcome**: Curves rendered on interactive canvas, roots highlighted, coordinate tooltips active.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-GRAPH-01` | Mode dropdown select | User selects "Graphing" | `SCR-GRAPH-CANVAS` | `FLW-GRAPH-01` |

## 3. Step-by-Step Decision Logic (`FLW-GRAPH-01`)

```text
START: [SCR-GRAPH-CANVAS: Formula sidebar on left, Cartesian grid on right]
  ↓
[User Action: Types formula into f(x) input box or drags canvas]
  ↓
DEC-GRAPH-01: Did user enter or edit formula text (e.g. "sin(x) * 2")?
  ├── YES → [Validate formula syntax for variable 'x']
  │         DEC-GRAPH-02: Is syntax valid?
  │            ├── NO  → [Render red inline syntax marker]
  │            │         (Maintain previous stable plot or clear active curve)
  │            └── YES → [Compile AST function evaluator: f(x)]
  │                      [Sample 2,000 points across viewport xMin..xMax]
  │                      [Detect and lift pen across vertical asymptotes]
  │                      [Draw curve with smooth anti-aliased path]
  │                      [Locate X-intercepts (roots) and draw marker dots]
  │                      EXIT: [Curve Rendered]
  │
  ├── Viewport Drag / Pan or Pinch / Zoom Gesture
  │     ↓
  │    [Update coordinate bounds: xMin, xMax, yMin, yMax]
  │    [Redraw Cartesian axis lines, grid ticks, and numbers]
  │    [Resample and render active curves]
  │    EXIT: [Viewport Updated]
  │
  └── Mouse Hover / Touch Drag along Curve
        ↓
       [Find closest sampled (x, y) point on active curve]
       [Render snapping circle pin on curve]
       [Render floating tooltip badge: "x: 1.57, y: 1.00"]
       EXIT: [Trace Displayed]
```

## 4. Error Recovery & Stalls
- `REC-GRAPH-01`: If user zooms into extreme scales ($10^{15}$ or $10^{-15}$), viewport clamps to prevent numeric overflow and displays a toast notice.
- `REC-GRAPH-02`: Clicking the "Reset View" (Home) icon immediately restores standard bounds $[-10, 10]$ on both axes.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
