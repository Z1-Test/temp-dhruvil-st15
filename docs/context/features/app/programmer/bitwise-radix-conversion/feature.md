---
type: Feature
title: "Programmer Bitwise Operations & Multi-Radix Conversion"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for Programmer Mode."
tags: [feature, programmer, bitwise, radix, binary, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Programmer Bitwise Operations & Multi-Radix Conversion

Authoritative product specification for programmer multi-base representations (HEX, DEC, OCT, BIN), bitwise logic gates, bit shifts, word sizes, and interactive 64-bit bitfields.

## 1. Problem, Actors & Outcome
- **Problem & Context**: Software engineers, embedded firmware developers, and systems architects constantly convert between Hex, Decimal, and Binary, debug register bitfields, and calculate bitmasks. Standard calculators lack base conversions or fail on negative Two's Complement representations.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-ENG` | `app/programmer` | Working with hex dumps, IP masks, or memory offsets | Full bitwise & radix manipulation |
- **Checkable Success ("This Worked")**: Number entered in any base simultaneously updates all four base displays (HEX, DEC, OCT, BIN); clicking individual bits in the 64-bit interactive bitfield flips values in real time; bitwise gates (`AND`, `OR`, `XOR`, `NOT`) truncate cleanly to the selected word size (`8`, `16`, `32`, `64` bits).
- **Checkable Failure ("This Is Broken")**: Bits outside word width fail to mask off; negative Two's Complement values display corrupt positive values; invalid digits (e.g. typing `A` in decimal mode) cause silent bugs.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - Multi-Radix Display: Simultaneous live values for `HEX` (Base 16), `DEC` (Base 10), `OCT` (Base 8), and `BIN` (Base 2).
  - Active Radix Selector: Dynamically enables/disables keypad digits (e.g. in `BIN`, digits 2–9 and A–F are disabled; in `HEX`, full 0–9 and A–F enabled).
  - Bitwise Logic: `AND`, `OR`, `XOR`, `NOT`, `NAND`, `NOR`, `XNOR`.
  - Bit Shifts & Rotations: `LSL` (Logical Shift Left), `LSR` (Logical Shift Right), `ASR` (Arithmetic Shift Right with sign preservation), `ROL` (Rotate Left), `ROR` (Rotate Right).
  - Word Sizes: `BYTE` (8-bit), `WORD` (16-bit), `DWORD` (32-bit), `QWORD` (64-bit).
  - Signed vs Unsigned toggle (Two's Complement).
  - Interactive Bitfield: Clickable matrix of 64 discrete bit blocks grouped into 4-bit nibbles.
  - Byte swap / Endianness conversion (Big Endian $\leftrightarrow$ Little Endian).
- **Refused / Owned Elsewhere**:
  - Fractional decimals are not supported in Programmer mode (integers only). Floating-point fractions belong to Standard and Scientific modes.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-PROG-01`: All calculations must be constrained to the active word size ($2^8, 2^{16}, 2^{32}, \text{or } 2^{64}$). High bits exceeding the word size are masked out immediately.
  - `RULE-PROG-02`: In Signed mode, the Most Significant Bit (MSB) of the selected word size serves as the Two's Complement sign bit.
  - `RULE-PROG-03`: Toggling any single bit in the 64-bit bitfield recalculates the integer value and syncs all 4 radix displays instantaneously.
  - `RULE-PROG-04`: Input digits outside the active radix are rejected and never appended to the buffer.
- **What Must Never Happen**:
  - `NEVER-PROG-01`: Never allow bitwise overflow to bleed into adjacent imaginary bit registers beyond the selected word size.
  - `NEVER-PROG-02`: Never desynchronize the values shown between the 4 radix rows and the interactive bitfield.

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ActiveRadix` | Enum (`HEX` \| `DEC` \| `OCT` \| `BIN`) | Committed | Yes (LocalStorage) | Yes | Last-write |
| `WordSize` | Integer (`8` \| `16` \| `32` \| `64`) | Committed | Yes (LocalStorage) | Yes | Last-write |
| `SignedMode` | Boolean | Committed | Yes (LocalStorage) | Yes | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Visual highlighting of active base and modified bit positions.
- **Audit Logging**: Calculation tape logs entries formatted in the currently active radix.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-PROG-01` | `programmer/bitwise-radix-conversion` | `history/manage-calculation-tape` | `{ hexValue, decValue, binValue, wordSize }` | Recorded tape entry | source | `RULE-PROG-01`, `RULE-PROG-02` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
