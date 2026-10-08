---
type: Actors
title: "Universal Calculator User Personas & Actors"
description: "Authoritative definition of target personas, user roles, arrival contexts, and capability requirements for the Universal Calculator."
status: stable
tags: [actors, personas, users, okf-v0.2]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/vision.md
---

# Universal Calculator User Personas & Actors

## 1. Actor Directory & Profiles

| Actor ID | Role / Persona | Description & Goals | Primary Calculation Surface | Core Requirements |
| :--- | :--- | :--- | :--- | :--- |
| `ACT-USER-STD` | **Everyday Consumer / Office Worker** | Needs rapid, frictionless arithmetic for daily chores, receipts, tips, discounts, and split bills. | Standard Mode, Quick Converter | Large tactile buttons, instant error-free decimals, percentage key, keyboard numpad support. |
| `ACT-USER-STEM` | **STEM Student & Researcher** | Evaluates multi-term formulas, trigonometric functions, logarithms, powers, and plots 2D curves. | Scientific Mode, Graphing Canvas | Exact transcendental evaluation, DEG/RAD/GRAD toggle, bracket matching, constant library ($\pi, e, \phi$). |
| `ACT-USER-ENG` | **Software & Systems Engineer** | Debugs memory addresses, bitmasks, network subnets, and register bitfields. | Programmer Mode | Simultaneous HEX/DEC/OCT/BIN display, interactive 64-bit toggles, logical/arithmetic bit shifts, 2's complement. |
| `ACT-USER-FIN` | **Financial Planner & Homeowner** | Compares loan EMIs, analyzes amortization schedules, computes compound interest, and converts currencies. | Financial Mode, Currency Converter | TVM inputs (PV, FV, PMT, Rate, Tenure), visual amortization chart, multi-currency offline rates. |

---

## 2. Behavioral Matrix & Input Preferences

```text
+---------------------+-------------------+-------------------+-------------------+
| Actor               | Primary Device    | Input Method      | Key Success Metric|
+---------------------+-------------------+-------------------+-------------------+
| Everyday Consumer   | Mobile Phone / PWA| Single-Hand Touch | Answer in <3 taps |
| STEM Student        | Laptop / Tablet   | Keyboard + Touch  | Formula inspection|
| Software Engineer   | Desktop Monitor   | Hardware Keyboard | Zero mouse clicks |
| Financial Planner   | Desktop / Tablet  | Mouse / Numpad    | Exportable table  |
+---------------------+-------------------+-------------------+-------------------+
```

---

## 3. Accessibility & Environmental Constraints

- **Accessibility**: Support for screen magnification up to 200%, voiceover / screen reader verbalization, high contrast OLED mode, and complete keyboard focus loops.
- **Offline Reliability**: All 4 actors require 100% functionality when disconnected from Wi-Fi or cellular data.
