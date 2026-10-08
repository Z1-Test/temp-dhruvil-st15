---
type: Test Cases
title: "Programmer Bitwise & Radix Conversion Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, bitwise gate verification, word size truncation, and traceability for Programmer Mode."
tags: [cases, test-cases, programmer, bitwise, radix, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Programmer Bitwise & Radix Conversion

Authoritative test scenarios for programmer radix conversions, bitwise operations, and bitfield interactions.

## 1. Scenario Specifications

### `CASE-PROG-01`: Multi-Radix Simultaneous Sync
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: Programmer mode active, `DEC` row focused, QWORD size.
- **Action Sequence / Input**: User types `255`.
- **Expected Outcome**: All 4 radix rows update synchronously and maintain 100% coherence with the 64-bit bitfield:
  - `HEX`: `FF`
  - `DEC`: `255`
  - `OCT`: `377`
  - `BIN`: `0000 0000 ... 1111 1111` (least significant 8 bits set to 1).
- **Enforces**: `RULE-PROG-03`, `NEVER-PROG-02`

### `CASE-PROG-02`: Bitwise XOR Operation with Word Masking
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: `BYTE` word size (8-bit) selected, `HEX` mode active.
- **Action Sequence / Input**: User inputs `0xAA XOR 0x55`, then presses `=`.
- **Expected Outcome**: `0xAA` ($10101010_2$) XOR `0x55` ($01010101_2$) evaluates to `0xFF` ($11111111_2$).
- **Enforces**: `RULE-PROG-01`

### `CASE-PROG-03`: Signed Two's Complement MSB Toggle
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: `BYTE` word size (8-bit), Signed mode active, display at `0`.
- **Action Sequence / Input**: User clicks bit index 7 (the MSB) on the bitfield.
- **Expected Outcome**: Bit 7 changes from 0 to 1 (`1000 0000`). `DEC` display updates to `-128`. `HEX` displays `80`.
- **Enforces**: `RULE-PROG-02`, `RULE-PROG-03`

### `CASE-PROG-04`: Word Size Truncation Downscale
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: Value is `0x1234` (16-bit WORD).
- **Action Sequence / Input**: User changes word size from `WORD` (16-bit) to `BYTE` (8-bit).
- **Expected Outcome**: Value masks to `0x34` (lower 8 bits retained, high byte truncated). Decimal updates from `4660` to `52`.
- **Enforces**: `RULE-PROG-01`, `NEVER-PROG-01`

### `CASE-PROG-05`: Arithmetic vs Logical Shift Right
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: `BYTE` size, Signed mode, value is `-8` (`0xF8` / `1111 1000`).
- **Action Sequence / Input**: User executes `ASR 1` (Arithmetic Shift Right).
- **Expected Outcome**: Sign bit is preserved: binary becomes `1111 1100`, decimal becomes `-4`.
- **Enforces**: `RULE-PROG-01`, `RULE-PROG-02`

### `CASE-PROG-06`: Out-of-Radix Digit Rejection
- **Actor**: `ACT-USER-ENG`
- **Preconditions**: Binary mode (`BIN`) active.
- **Action Sequence / Input**: User presses digit `2` on keyboard or keypad.
- **Expected Outcome**: Keystroke is rejected as invalid in base 2; input buffer is unchanged.
- **Enforces**: `RULE-PROG-04`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-PROG-03` | `DEC-PROG-01` | `CASE-PROG-01` | Radix Sync | `tests/unit/programmer-radix.test.ts` |
| `NEVER-PROG-02` | `DEC-PROG-01` | `CASE-PROG-01` | Display Coherence | `tests/unit/programmer-radix.test.ts` |
| `RULE-PROG-01` | `DEC-PROG-01` | `CASE-PROG-02` | Bitwise Logic | `tests/unit/programmer-bitwise.test.ts` |
| `RULE-PROG-02` | `DEC-PROG-01` | `CASE-PROG-03` | Two's Complement | `tests/unit/programmer-twos-comp.test.ts` |
| `RULE-PROG-01` | `DEC-PROG-01` | `CASE-PROG-04` | Word Truncation | `tests/unit/programmer-word-size.test.ts` |
| `NEVER-PROG-01` | `DEC-PROG-01` | `CASE-PROG-04` | Boundary Protection | `tests/unit/programmer-word-size.test.ts` |
| `RULE-PROG-04` | `DEC-PROG-01` | `CASE-PROG-06` | Input Guard | `tests/unit/programmer-radix.test.ts` |

## 3. Cases N/A Declarations
- **Fractional Float Decimals**: N/A (Programmer mode strictly evaluates discrete integers).
- **Late Webhook Replay**: N/A (Client-only bitwise calculation).

## 4. Unhandled Stall Checklist
- [x] High-order bits beyond active word size are immediately discarded without state pollution.
- [x] Invalid digits in active base are safely ignored and do not corrupt buffer.
- [x] Two's complement display correctly switches sign when toggling MSB bit.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
