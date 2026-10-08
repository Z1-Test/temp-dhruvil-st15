---
type: Feature
title: "Convert Physical Units & Dimensional Measurements"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for Unit Conversion."
tags: [feature, converter, units, dimensions, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Convert Physical Units & Dimensional Measurements

Authoritative product specification for dimensional measurement conversions across Length, Mass, Temperature, Volume, Area, Speed, Time, Digital Storage, Energy, and Pressure.

## 1. Problem, Actors & Outcome
- **Problem & Context**: Users frequently need to convert between imperial and metric systems or between engineering units (e.g. Celsius to Fahrenheit, Gigabytes to Megabytes, Pounds to Kilograms). Incomplete conversion tools lack bi-directional editing, introduce floating-point rounding errors, or omit vital categories like digital storage.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-STD` | `app/converter` | Preparing recipes, travel distances, or hardware specs | Full unit conversion |
  | `ACT-USER-STEM` | `app/converter` | Lab experiments, thermodynamics, or physics | High-precision scientific units |
- **Checkable Success ("This Worked")**: Selecting any category presents standard units; entering a number in the "From" input immediately converts the "To" input; typing in the "To" input reciprocally updates the "From" input without feedback loops; temperature formulas correctly account for non-linear scale offsets ($^\circ\text{F} = ^\circ\text{C} \cdot \frac{9}{5} + 32$).
- **Checkable Failure ("This Is Broken")**: Converting temperatures below Absolute Zero without warning; infinite loops during bi-directional synchronization.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - 10 Dimensional Categories:
    1. **Length**: Meter, Kilometer, Centimeter, Millimeter, Inch, Foot, Yard, Mile, Nautical Mile.
    2. **Mass**: Kilogram, Gram, Milligram, Metric Ton, Pound (lb), Ounce (oz), Stone.
    3. **Temperature**: Celsius, Fahrenheit, Kelvin, Rankine.
    4. **Volume**: Liter, Milliliter, Cubic Meter, Gallon (US), Quart, Pint, Cup, Fluid Ounce.
    5. **Area**: Square Meter, Square Kilometer, Square Foot, Square Mile, Acre, Hectare.
    6. **Speed**: Meters per second (m/s), Kilometers per hour (km/h), Miles per hour (mph), Knots, Mach.
    7. **Time**: Milliseconds, Seconds, Minutes, Hours, Days, Weeks, Months (30.4375d avg), Years.
    8. **Digital Storage**: Bits, Bytes, KB, MB, GB, TB, PB (with toggle for Base 10 `1000` vs Binary `1024` KiB/MiB).
    9. **Energy**: Joules, Kilojoules, Calories, Kilocalories, Watt-hours, Kilowatt-hours (kWh), BTU.
    10. **Pressure**: Pascal, Kilopascal, Bar, PSI, Atmosphere (atm), Torr/mmHg.
  - Interactive Features:
    - Bi-directional live typing (edit either side).
    - Unit swap button ($\rightleftarrows$).
    - Copy formatted result to clipboard.
- **Refused / Owned Elsewhere**:
  - Live volatile cryptocurrency trading prices are out of scope.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-CONV-01`: Standard linear conversions convert to a canonical base SI unit before converting to the target unit ($v_{\text{target}} = \frac{v_{\text{source}} \cdot factor_{\text{source}}}{factor_{\text{target}}}$).
  - `RULE-CONV-02`: Affine temperature conversions must apply constant offsets before scaling (e.g. Kelvin $\leftrightarrow$ Celsius $\leftrightarrow$ Fahrenheit).
  - `RULE-CONV-03`: Physical lower bounds: Temperature values below absolute zero ($0\text{ K}$, $-273.15^\circ\text{C}$, $-459.67^\circ\text{F}$) must trigger an inline physical boundary warning.
  - `RULE-CONV-04`: Bi-directional updates must be guarded against cycle oscillations by tracking the active editing source input.
- **What Must Never Happen**:
  - `NEVER-CONV-01`: Never create an infinite event loop when updating synchronized twin inputs.
  - `NEVER-CONV-02`: Never use lossy floating-point division when converting integer digital storage units.

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `LastCategory` | Enum (10 categories) | Committed | Yes (LocalStorage) | Yes | Last-write |
| `LastUnits` | Pair `{ fromUnit, toUnit }` | Committed | Yes (LocalStorage) | Yes | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Toast message upon copying converted value to clipboard.
- **Audit Logging**: Recorded to History Tape as a completed conversion entry.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-CONV-01` | `converter/convert-units` | `history/manage-calculation-tape` | `{ category, fromVal, toVal, units }` | Recorded tape entry | source | `RULE-CONV-01` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
