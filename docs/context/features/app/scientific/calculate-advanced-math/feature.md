---
type: Feature
title: "Calculate Advanced Scientific & Transcendental Functions"
status: planning_ready
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for Scientific Mode."
tags: [feature, scientific, trigonometry, math, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Calculate Advanced Scientific & Transcendental Functions

Authoritative product specification for scientific trigonometry, logarithms, powers, roots, combinatorial functions, angular unit modes, and mathematical constants.

## 1. Problem, Actors & Outcome
- **Problem & Context**: STEM students, engineers, and researchers require complex transcendental and exponential formulas. In basic calculators, users lack trig functions, cannot toggle between radians and degrees, or get cryptic errors when evaluating scientific powers and negative roots.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-STEM` | `app/scientific` | Standard calculator or direct scientific mode launch | Full scientific execution |
- **Checkable Success ("This Worked")**: Functions like $\sin(30^\circ) = 0.5$, $\ln(e) = 1$, and $2^{10} = 1024$ evaluate with high precision; mode indicator displays active angle mode (`DEG` / `RAD` / `GRAD`); `2nd` function toggle swaps between direct and inverse operations.
- **Checkable Failure ("This Is Broken")**: Incorrect angle interpretation (e.g. evaluating $\sin(30)$ in radians when `DEG` is indicated); division by zero or negative square root crashes the interface.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - Trigonometry: `sin`, `cos`, `tan`, `csc`, `sec`, `cot`.
  - Inverse Trigonometry: `asin`, `acos`, `atan`, `acsc`, `asec`, `acot`.
  - Hyperbolic Trigonometry: `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`.
  - Angle Modes: Degrees (`DEG`), Radians (`RAD`), Gradians (`GRAD`) with live UI indicator.
  - Logarithms & Exponents: `ln` ($\log_e$), `log10`, `log_y(x)`, $e^x$, $10^x$, $2^x$.
  - Powers & Roots: $x^2$, $x^3$, $x^y$, $\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt[y]{x}$.
  - Discrete & Combinatorial: Factorial ($n!$), Combinations ($nCr$), Permutations ($nPr$), Modulo ($x \pmod y$), Absolute value ($|x|$).
  - Constants: $\pi$ (Pi $\approx 3.1415926535$), $e$ (Euler's number $\approx 2.7182818284$), $\phi$ (Golden ratio $\approx 1.6180339887$).
  - Scientific notation button `EXP` / `EE`.
  - `2nd` key toggle to alternate between primary and inverse functions.
- **Refused / Owned Elsewhere**:
  - 2D coordinate plotting of equations is owned by `graphing/plot-functions`.
  - Bitwise manipulation is owned by `programmer/bitwise-radix-conversion`.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-SCI-01`: Trigonometric functions must respect the active angle mode (`DEG`, `RAD`, `GRAD`) at the exact moment of evaluation.
  - `RULE-SCI-02`: Real-mode domain restrictions:
    - $\sqrt{x}$ requires $x \ge 0$.
    - $\ln(x)$ and $\log(x)$ require $x > 0$.
    - $\arcsin(x)$ and $\arccos(x)$ require $-1 \le x \le 1$.
    - Violation returns an explicit inline domain error (`Domain Error: Input out of range`).
  - `RULE-SCI-03`: Factorial ($n!$) is defined for non-negative integers up to $n = 10,000$. Non-integer factorial evaluates via Gamma function $\Gamma(n+1)$ or reports positive integer requirement.
  - `RULE-SCI-04`: Transcendental constant buttons ($\pi, e, \phi$) insert their symbol token into the expression, which expands to full internal precision (up to 100 digits) during calculation.
- **What Must Never Happen**:
  - `NEVER-SCI-01`: Never evaluate trigonometric operations using the wrong angle unit without explicit visual indication to the user.
  - `NEVER-SCI-02`: Never freeze the UI when calculating large factorials ($n!$) or exponential powers ($x^y$).

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AngleMode` | Enum (`DEG` \| `RAD` \| `GRAD`) | Committed | Yes (LocalStorage) | Yes | Last-write |
| `ScientificExpression` | String token stream | Draft | Yes (LocalStorage) | Yes | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Audio or visual badge indicates angle mode transition (`DEG` $\to$ `RAD` $\to$ `GRAD`).
- **Audit Logging**: Recorded to History Tape with explicit angle unit metadata.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-SCI-01` | `scientific/calculate-advanced-math` | `history/manage-calculation-tape` | `{ expression, result, angleMode }` | Tape recorded entry | source | `RULE-SCI-01`, `RULE-SCI-02` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
