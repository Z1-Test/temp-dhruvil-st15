---
type: Guide
title: "Universal Calculator Context Documentation"
description: "Documentation entrypoint, architecture guide, and comprehensive feature directory for the Universal Calculator."
status: stable
tags: [overview, documentation, guide, calculator]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - id: source-index
    resource: docs/context/index.md
    title: Documentation Index
---

# Universal Calculator Context Documentation

## 1. Overview & System Mission

The **Universal Calculator** is a high-precision, multi-domain computational application designed for everyday consumers, STEM students and researchers, software engineers, and financial analysts. It combines 7 specialized calculation modes with an interactive calculation audit tape:

1. **Standard Mode**: Everyday four-function arithmetic, BODMAS/PEMDAS order-of-operations, contextual percentages, and live preview.
2. **Scientific Mode**: Trigonometric, hyperbolic, logarithmic, exponential, combinatorial, and angular unit (`DEG`/`RAD`/`GRAD`) functions with mathematical constants ($\pi, e, \phi$).
3. **Programmer Mode**: Multi-base simultaneous display (`HEX`, `DEC`, `OCT`, `BIN`), bitwise logic gates, bit shifts, word sizes (8/16/32/64 bits), Two's Complement, and interactive 64-bit clickable bitfields.
4. **Financial Mode**: Loan/Mortgage EMI calculation, month-by-month amortization schedules, simple/compound interest, Time Value of Money (TVM), profit margin, sales tax, and bill splitting.
5. **Unit & Currency Converter**: 10 dimensional categories (Length, Mass, Temperature, Speed, Volume, Area, Time, Digital Storage, Energy, Pressure) with bi-directional real-time conversion.
6. **2D Graphing Mode**: Cartesian function plotting $y = f(x)$, multi-curve overlays, viewport pan/zoom, interactive coordinate tracing, root finding, and singularity/asymptote protection.
7. **Calculation Tape & Memory**: Persistent chronological audit log, note annotations, export to CSV/JSON, search/filter, and classical/multi-slot memory registers (`MC`, `MR`, `M+`, `M-`, `MS`).

---

## 2. Decoupled Core Architecture

The calculator strictly enforces a **Hexagonal / Port-and-Adapter** architecture:
- **Core Math Engine (Pure)**: Headless, pure TypeScript library with zero UI or DOM dependencies. Arbitrary-precision decimal arithmetic eliminates all IEEE 754 floating-point errors (e.g. `0.1 + 0.2 === 0.3`).
- **Presentation Layer (Interchangeable)**: Decoupled UI surface that can be implemented as a Web PWA, Desktop Tauri/Electron shell, or Mobile app.

---

## 3. Documentation Directory Map

```text
docs/context/
├── README.md                                  # You are here: Root documentation entrypoint
├── index.md                                   # OKF v0.2 concept catalog index
├── project/                                   # Project-level architecture and rules
│   ├── vision.md                              # Product vision, mission, and non-goals
│   ├── tech.md                                # Technology stack evaluation and strategy
│   ├── architecture.md                        # Macro system topology & AST pipeline
│   ├── actors.md                              # User personas and actor profiles
│   ├── glossary.md                            # Math and computing terminology glossary
│   ├── domain-rules.md                        # Mathematical invariants & error rules
│   ├── conventions.md                         # Engineering standards & verification gates
│   └── decisions/                             # Architectural Decision Records (ADRs)
│       ├── 001-initial-architecture.md        # ADR 001: Decoupled Core Math Engine
│       ├── 002-numeric-precision-strategy.md  # ADR 002: Arbitrary-Precision Decimals
│       └── 003-ast-expression-parser.md       # ADR 003: AST Shunting-Yard Parser
├── system/                                    # System conventions & constraints
│   ├── start-here.md                          # Developer onboarding and reading order
│   ├── stack.md                               # System layers and interface contracts
│   └── constraints.md                         # Performance, precision & a11y bounds
├── features/app/                              # 3-File Feature Slices (feature, flow, cases)
│   ├── standard/evaluate-arithmetic/          # Standard arithmetic & BODMAS
│   ├── scientific/calculate-advanced-math/    # Scientific trig, powers, logs & constants
│   ├── programmer/bitwise-radix-conversion/   # Radix conversions, bitwise & bitfield
│   ├── financial/compute-loan-interest/       # Loan EMI, amortization & TVM
│   ├── converter/convert-units/               # 10-category dimensional converter
│   ├── graphing/plot-functions/               # 2D Cartesian curve plotter & trace
│   └── history/manage-calculation-tape/       # Persistent tape log & memory registers
└── journeys/app/                              # End-to-end macro user journey maps
    ├── standard-daily-calculation.md          # Everyday shopping & discount journey
    ├── programmer-binary-debugging.md         # Systems engineer bitwise debugging
    └── financial-mortgage-planning.md         # Mortgage planning & amortization export
```

---

## 4. Verification & Validation

This documentation conforms 100% to Google Open Knowledge Format (OKF v0.2) and StayPlan Stage 2 specification standards. Validate repository conformance at any time via:
```bash
node --experimental-strip-types ~/.gemini/config/plugins/stayplan/skills/stayplan-okf/scripts/stayokf.ts validate
```
