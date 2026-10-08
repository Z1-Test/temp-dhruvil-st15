---
type: Flow
title: "Convert Physical Units User Flow"
status: draft
description: "User interaction logic, category selection, unit picking, bi-directional editing, and swap flow for Unit Conversion."
tags: [flow, converter, units, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Convert Physical Units

Authoritative user interaction logic, category picker, unit selectors, bi-directional input synchronization, and unit swap flow.

## 1. Flow Overview
- **Goal**: Select a measurement category, choose source and target units, and input numbers with instant bi-directional conversion.
- **Primary Surface**: `app/converter`
- **Actor Role**: `ACT-USER-STD` / `ACT-USER-STEM`
- **Entry Trigger**: User selects "Unit Converter" from navigation or mode selector.
- **Exit Outcome**: Converted measurement displayed, copyable to clipboard, preserved in state.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-CONV-01` | Mode dropdown select | User selects "Unit Converter" | `SCR-CONV-WORKSPACE` | `FLW-CONV-01` |

## 3. Step-by-Step Decision Logic (`FLW-CONV-01`)

```text
START: [SCR-CONV-WORKSPACE: Category tabs at top, "From" card on left, "To" card on right]
  ↓
[User Action: Switches category, picks unit, or enters number]
  ↓
DEC-CONV-01: Did user click a Category Tab (Length, Mass, Temp...)?
  ├── YES → [Update active category]
  │         [Populate dropdowns with category default units (e.g. Length: m ↔ ft)]
  │         [Initialize "From" value to 1, compute "To" value]
  │         EXIT: [Category Selected]
  │
  ├── Swap Button Click (⇄)
  │     ↓
  │    [Exchange From Unit ↔ To Unit]
  │    [Recalculate target value with new orientation]
  │    EXIT: [Units Swapped]
  │
  └── Value Input into "From" or "To" box
        ↓
       DEC-CONV-02: Is category Temperature and value < Absolute Zero?
            ├── YES → [Render warning badge: "Temperature below Absolute Zero (0 K)"]
            │         [Proceed with calculated mathematical value]
            └── NO  → (Normal calculation)
                        ↓
                   [Convert input value to Base SI unit]
                   [Convert Base SI unit to Target unit]
                   [Update opposite input field without re-triggering listener cycle]
                   EXIT: [Value Synchronized]
```

## 4. Error Recovery & Stalls
- `REC-CONV-01`: When switching between categories with vastly different scales, the destination value resets to `1` of the source unit to prevent overflowing displays with stale numbers.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
