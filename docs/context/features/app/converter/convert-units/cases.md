---
type: Test Cases
title: "Convert Physical Units Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, dimensional accuracy verification, 12-stall matrix, and traceability for Unit Conversion."
tags: [cases, test-cases, converter, units, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Convert Physical Units

Authoritative test scenarios for physical dimensional conversions, temperature offsets, and digital storage.

## 1. Scenario Specifications

### `CASE-CONV-01`: Non-Linear Temperature Offset ($^\circ\text{C} \leftrightarrow ^\circ\text{F}$)
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Temperature category selected, From = Celsius, To = Fahrenheit.
- **Action Sequence / Input**: User inputs `100` in Celsius.
- **Expected Outcome**: Fahrenheit field updates to `212.0`. User inputs `0` Celsius; Fahrenheit updates to `32.0`. User inputs `-40`; Fahrenheit updates to `-40.0`.
- **Enforces**: `RULE-CONV-02`

### `CASE-CONV-02`: Absolute Zero Lower Bound Warning
- **Actor**: `ACT-USER-STEM`
- **Preconditions**: Temperature category, From = Celsius.
- **Action Sequence / Input**: User enters `-300`.
- **Expected Outcome**: Field calculates `-508.0 °F`, but displays persistent amber warning badge: `Value is below Absolute Zero (0 K / -273.15 °C)`.
- **Enforces**: `RULE-CONV-03`

### `CASE-CONV-03`: Digital Storage Binary vs Decimal Mode
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: Digital storage category, From = Gigabytes (GB), To = Megabytes (MB).
- **Action Sequence / Input**:
  - In Decimal mode (Base 10): 1 GB = `1000 MB`.
  - In Binary mode (Base 2 / GiB): 1 GiB = `1024 MiB`.
- **Expected Outcome**: Values calculate exactly without floating-point fraction errors.
- **Enforces**: `RULE-CONV-01`, `NEVER-CONV-02`

### `CASE-CONV-04`: Length & Imperial/Metric Conversion
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Length category, From = Miles, To = Kilometers.
- **Action Sequence / Input**: User enters `10` miles.
- **Expected Outcome**: Kilometers field displays `16.09344 km`.
- **Enforces**: `RULE-CONV-01`

### `CASE-CONV-05`: Bi-Directional Synchronization Loop Prevention
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Active length converter (Meter $\leftrightarrow$ Feet).
- **Action Sequence / Input**: User types rapidly in the "Feet" input box.
- **Expected Outcome**: "Meter" input updates synchronously. The update does not trigger a reciprocal synthetic input event on "Feet", avoiding recursive jitter.
- **Enforces**: `RULE-CONV-04`, `NEVER-CONV-01`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-CONV-02` | `DEC-CONV-02` | `CASE-CONV-01` | Temperature Offsets | `tests/unit/converter-temp.test.ts` |
| `RULE-CONV-03` | `DEC-CONV-02` | `CASE-CONV-02` | Physical Boundaries | `tests/unit/converter-temp.test.ts` |
| `RULE-CONV-01` | `DEC-CONV-02` | `CASE-CONV-03` | Digital Storage | `tests/unit/converter-digital.test.ts` |
| `RULE-CONV-01` | `DEC-CONV-02` | `CASE-CONV-04` | Metric / Imperial | `tests/unit/converter-length.test.ts` |
| `RULE-CONV-04` | `DEC-CONV-02` | `CASE-CONV-05` | Event Loop Guard | `tests/unit/converter-sync.test.ts` |

## 3. Cases N/A Declarations
- **Late Webhook Replay**: N/A (Client-only calculation).
- **Undo / Reversal**: N/A (Handled via Swap button $\rightleftarrows$).

## 4. Unhandled Stall Checklist
- [x] Absolute Zero boundary conditions render clear warnings.
- [x] Bi-directional input synchronization does not cause event loops.
- [x] Unit conversions preserve exact fractional definitions (e.g. 1 inch = exactly 25.4 mm).

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
