---
type: Journey
title: "Software Engineer Binary & Bitmask Debugging Journey"
status: draft
description: "Human story, beat-by-beat narrative, emotion signals, and friction interventions for programmer bitwise debugging."
tags: [journey, user-journey, programmer, binary, bitwise, okf-v0.2]
sources:
  - resource: ../../project/vision.md
  - resource: ../../project/actors.md
---

# User Journey: Software Engineer Binary & Bitmask Debugging

- **Surface**: `app`
- **Primary Actor**: `ACT-USER-ENG` (Software Engineer)
- **User Goal**: Inspect a hardware register bitmask in Hex, toggle specific control bits, and read the resulting Two's Complement signed decimal and binary values.

## 1. Slices in Sequence
1. `features/app/programmer/bitwise-radix-conversion/` — Input hex address, toggle bitfield bits, and perform bitwise AND/OR operations.
2. `features/app/history/manage-calculation-tape/` — Save register values to tape with memory offset notes.

## 2. Beat Matrix (Story & Experience)

| Beat ID | Slice | Action & Context | User Emotion | Friction & Risk | System Intervention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `BEAT-ENG-01` | `programmer/bitwise-radix-conversion` | Switches to Programmer Mode and focuses `HEX` row | 😀 Confident | Inconvenient mouse clicks | Full keyboard shortcuts (`Alt+H` for Hex, `Alt+D` for Dec) |
| `BEAT-ENG-02` | `programmer/bitwise-radix-conversion` | Types `0xDEADBEEF` | 😐 Expectant | Mental conversion to binary | All 4 base rows update instantly; 64-bit bitfield lights up |
| `BEAT-ENG-03` | `programmer/bitwise-radix-conversion` | Toggles bit 15 on the interactive bitfield matrix | 😀 Delighted | Forgetting bit index | Clickable bit block flips $0 \leftrightarrow 1$; updates Hex value to `0xDEAD3EEF` |
| `BEAT-ENG-04` | `programmer/bitwise-radix-conversion` | Applies bitwise operation `AND 0xFFFF` with `WORD` size | 😀 Delighted | High-order bits bleeding into result | Engine automatically masks to 16 bits (`0x3EEF`) |

## 3. Friction & Solutions (`FRC-*`)

| ID | Type | Impact × Frequency | Fix |
| :--- | :--- | :--- | :--- |
| `FRC-ENG-01` | Confusion | Quick Win | Group 64-bit bitfield into color-delimited 4-bit nibbles and 8-bit bytes with index labels. |
| `FRC-ENG-02` | Missing Info | Major Improvement | Simultaneous live display of HEX, DEC, OCT, and BIN removes need to toggle views to check values. |

## 4. References
- [Programmer Bitwise & Radix Conversion](../../features/app/programmer/bitwise-radix-conversion/feature.md)
- [Manage Calculation Tape](../../features/app/history/manage-calculation-tape/feature.md)
