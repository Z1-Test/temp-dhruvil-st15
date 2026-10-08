---
type: Flow
title: "Programmer Bitwise & Radix Conversion User Flow"
status: draft
description: "User interaction logic, base selection, bit toggling, word size adjustment, and bitwise execution for Programmer Mode."
tags: [flow, programmer, radix, bitwise, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Programmer Bitwise & Radix Conversion

Authoritative user interaction logic, multi-base sync, bitfield manipulation, and bitwise operator flow for Programmer Mode.

## 1. Flow Overview
- **Goal**: Enter values in Hex, Dec, Oct, or Binary, perform bitwise operations, toggle individual bits, and switch word sizes.
- **Primary Surface**: `app/programmer`
- **Actor Role**: `ACT-USER-ENG`
- **Entry Trigger**: User switches mode selector to "Programmer".
- **Exit Outcome**: Value converted simultaneously across all 4 bases, bitfield synchronized, operations executed.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-PROG-01` | Mode dropdown select | User selects "Programmer" | `SCR-PROG-WORKSPACE` | `FLW-PROG-01` |

## 3. Step-by-Step Decision Logic (`FLW-PROG-01`)

```text
START: [SCR-PROG-WORKSPACE: Display with 4 Radix Rows (HEX, DEC, OCT, BIN) & 64-bit Bitfield]
  ↓
[User Action: Interacts with Radix Row, Bitfield, or Keypad]
  ↓
DEC-PROG-01: Did user click a different Radix row (HEX / DEC / OCT / BIN)?
  ├── YES → [Set active radix]
  │         [Enable compatible keypad buttons (e.g. enable A-F in HEX, disable in DEC)]
  │         [Update cursor focus to selected base row]
  │         EXIT: [Radix Switched]
  │
  ├── Word Size Click (BYTE / WORD / DWORD / QWORD)
  │     ↓
  │    [Mask current accumulator value to new bit width: 8, 16, 32, or 64 bits]
  │    [Dim unavailable higher bit blocks in 64-bit bitfield]
  │    [Recalculate and update all 4 radix rows]
  │    EXIT: [Word Size Updated]
  │
  ├── Bitfield Block Click (Bit Index 0..63)
  │     ↓
  │    [Flip selected bit: 0 ↔ 1]
  │    [Reconstruct BigInt integer value from bit array]
  │    [Format and refresh HEX, DEC, OCT, BIN rows simultaneously]
  │    EXIT: [Bitfield Updated]
  │
  └── Bitwise Operator / Numeric Keypad Press (e.g. "AND", "XOR", "LSL 2", "0xFF")
        ↓
       [Apply bitwise operation with active word mask]
       [Update bitfield state and all 4 radix lines]
       EXIT: [Operation Evaluated]
```

## 4. Error Recovery & Stalls
- `REC-PROG-01`: If user attempts to enter a digit invalid in the current base (e.g. typing `8` while in `OCT` mode, or `C` while in `DEC` mode), the button is visually disabled and keyboard keystroke triggers a subtle tactile shake animation with zero buffer modification.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
