---
type: Guide
title: "Universal Calculator Developer Onboarding & System Start Here"
description: "Developer entrypoint, architecture overview, repository navigation, and feature map for the Universal Calculator project."
status: stable
tags: [guide, onboarding, system, start-here]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - id: source-vision
    resource: docs/context/project/vision.md
    title: Product Vision
  - id: source-arch
    resource: docs/context/project/architecture.md
    title: System Architecture
---

# Universal Calculator Developer Onboarding & System Start Here

## 1. Welcome to Universal Calculator

The **Universal Calculator** is an open, modular, extensible mathematical workbench. It unites everyday arithmetic, scientific formulas, programmer bitwise manipulation, financial loan analysis, unit conversions, and interactive 2D function plotting into a cohesive user experience.

### Key Architecture Axiom:
The **Core Math Engine is 100% decoupled from the UI framework**. Whether the application is bundled as a Web PWA, Desktop Tauri app, or Mobile client, the mathematical pipeline remains purely functional, deterministic, and identical across all targets.

---

## 2. Documentation Map & Reading Order

To understand the project thoroughly, read the context files in this sequence:

1. **Strategic Intent**:
   - [Product Vision](../project/vision.md) — Mission, goals, and non-goals.
   - [User Personas & Actors](../project/actors.md) — Target user personas and their calculation workflows.
2. **Architecture & Engineering Rules**:
   - [System Architecture](../project/architecture.md) — Macro topology and AST pipeline.
   - [Technology Stack Strategy](../project/tech.md) — Evaluation of web, desktop, and mobile options.
   - [Domain Rules & Mathematical Invariants](../project/domain-rules.md) — Invariants, division by zero, and precision contracts.
   - [Mathematical Glossary](../project/glossary.md) — Terminology definitions (AST, RPN, TVM, Radix).
   - [Engineering Conventions](../project/conventions.md) — Code standards, test vectors, and error types.
3. **Architectural Decisions (ADRs)**:
   - [ADR 001: Decoupled Core Math Engine](../project/decisions/001-initial-architecture.md)
   - [ADR 002: Arbitrary-Precision Decimal Representation](../project/decisions/002-numeric-precision-strategy.md)
   - [ADR 003: AST-Based Expression Evaluation](../project/decisions/003-ast-expression-parser.md)
4. **Feature Slices (Under `docs/context/features/app/`)**:
   - `standard/evaluate-arithmetic/`: Standard arithmetic, BODMAS, %, decimals, backspace.
   - `scientific/calculate-advanced-math/`: Trig, logs, powers, roots, constants, DEG/RAD/GRAD.
   - `programmer/bitwise-radix-conversion/`: Hex/Dec/Oct/Bin, bitwise gates, bit shifts, word sizes.
   - `financial/compute-loan-interest/`: EMI loan calculation, amortization, simple/compound interest, TVM.
   - `converter/convert-units/`: Unit conversions across 10 categories.
   - `graphing/plot-functions/`: 2D function plotting and Cartesian exploration.
   - `history/manage-calculation-tape/`: Memory registers, calculation tape, export, annotations.
5. **Macro User Journeys (Under `docs/context/journeys/app/`)**:
   - Step-by-step user journey maps detailing emotions, actions, and system states.

---

## 3. Development & Verification Principles

- **Zero Tolerance for Float Drift**: Every arithmetic test must assert exact base-10 values (e.g. `0.1 + 0.2 === 0.3`).
- **Keyboard First**: Every button on every keypad mode must map to a physical hardware keyboard shortcut.
- **Offline By Default**: Zero external API dependencies required for calculation functions.
