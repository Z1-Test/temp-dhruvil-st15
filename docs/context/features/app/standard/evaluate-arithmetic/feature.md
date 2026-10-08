---
type: Feature
title: "Evaluate Standard Arithmetic & Expression Preview"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for Standard Arithmetic."
tags: [feature, standard, arithmetic, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Evaluate Standard Arithmetic & Expression Preview

Authoritative product specification for standard four-function arithmetic, percentage evaluation, operator precedence, and real-time live preview.

## 1. Problem, Actors & Outcome
- **Problem & Context**: Users needing rapid everyday calculation frequently encounter inaccurate decimal rounding (`0.1 + 0.2 = 0.30000000000000004`), unexpected operator precedence in immediate-execution calculators (`2 + 3 * 4 = 20` instead of `14`), or frustrating loss of entered expressions upon typos.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-STD` | `app/standard` | Empty display or continuing from previous result accumulator | Full input & evaluation |
- **Checkable Success ("This Worked")**: Mathematical expression parses according to BODMAS/PEMDAS; live preview updates dynamically on each keystroke; pressing `=` commits result with exact decimal accuracy; expression and answer append to calculation tape.
- **Checkable Failure ("This Is Broken")**: Decimal drift occurs (e.g. `0.30000000000000004`); unhandled crash on divide-by-zero; or UI locks up.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - Four basic operators: Addition (`+`), Subtraction (`-`), Multiplication (`*` / `×`), Division (`/` / `÷`).
  - Parentheses handling: Open `(`, close `)`, nested brackets, auto-balancing open parentheses on commit.
  - Percentage operations: Multiplicative, additive markup (`+ %`), subtractive discount (`- %`).
  - Input controls: Sign negation (`+/-`), decimal point (`.`), Backspace / Delete (`⌫`), Clear Entry (`CE`), All Clear (`AC`).
  - Live result preview in secondary display line as expression is typed.
- **Refused / Owned Elsewhere**:
  - Trigonometric and logarithmic functions are owned by `scientific/calculate-advanced-math`.
  - Multi-base and bitwise logic are owned by `programmer/bitwise-radix-conversion`.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-STD-01`: Multiplication and division hold higher precedence than addition and subtraction unless overridden by parentheses.
  - `RULE-STD-02`: Consecutive operators replace the preceding operator (e.g. `5 + * 3` becomes `5 * 3`), with the exception of unary negation (e.g. `5 * -3`).
  - `RULE-STD-03`: A numeric operand cannot contain more than one decimal point. Typing a second decimal point in the same operand is a no-op.
  - `RULE-STD-04`: Division by zero must return an inline error `Cannot divide by zero` and disable the commit action until corrected.
  - `RULE-STD-05`: Pressing an operator immediately after committing a result uses the committed result as the first operand of the new expression.
- **What Must Never Happen**:
  - `NEVER-STD-01`: Never output IEEE-754 binary floating-point drift in standard decimal displays.
  - `NEVER-STD-02`: Never crash or clear user input when syntax errors or unclosed parentheses occur.

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State (Draft vs Committed) | Survives Page Refresh? | Survives App Kill? | Survives Logout / Login? | Conflict Winner (2 Sessions) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ActiveExpression` | Ephemeral memory | Draft | Yes (LocalStorage buffer) | Yes | N/A (Local-only) | Last-write |
| `CommittedResult` | String accumulator | Committed | Yes (LocalStorage) | Yes | N/A | Last-write |
| `HistoryItem` | UUIDv4 | Committed | Yes (IndexedDB) | Yes | N/A | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Screen reader announcement via `aria-live="polite"` on result confirmation; `aria-live="assertive"` on division-by-zero error.
- **Audit Logging**: Successful evaluations append an immutable entry to the History Tape.
- **Reporting Metrics**: Increments local counter for calculations completed.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-STD-01` | `standard/evaluate-arithmetic` | `history/manage-calculation-tape` | `{ expression, result, timestamp }` | Tape item confirmation | source | `RULE-STD-01`, `NEVER-STD-01` |
| `SEAM-STD-02` | `history/manage-calculation-tape` | `standard/evaluate-arithmetic` | `{ recalledResult: string }` | Replaced active accumulator | destination | `RULE-STD-05` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
