---
type: Test Cases
title: "Manage Calculation Tape & Memory Test Cases & Scenarios"
status: draft
description: "Unified test scenarios, memory persistence, export integrity, and traceability for History Tape."
tags: [cases, test-cases, history, tape, memory, okf-v0.2]
sources:
  - resource: ./feature.md
  - resource: ./flow.md
---

# Test Cases: Manage Calculation Tape & Memory

Authoritative test scenarios for calculation tape persistence, memory registers, item recall, and export integrity.

## 1. Scenario Specifications

### `CASE-HIST-01`: Tape Record Persistence across Browser Refresh
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Fresh session.
- **Action Sequence / Input**: User calculates `45 * 12 = 540`, then hard-reloads browser tab (`Cmd+R` / `F5`).
- **Expected Outcome**: History drawer contains `45 * 12 = 540` with accurate ISO timestamp and "Standard" mode badge.
- **Enforces**: `RULE-HIST-01`, `NEVER-HIST-02`

### `CASE-HIST-02`: Clear All (`AC`) Does Not Delete History Tape
- **Actor**: `ACT-USER-STD`
- **Preconditions**: History tape contains 5 completed calculations.
- **Action Sequence / Input**: User presses `AC` twice on the keypad.
- **Expected Outcome**: Active display resets to `0`, but all 5 entries in the History Tape remain fully intact and visible.
- **Enforces**: `RULE-HIST-02`

### `CASE-HIST-03`: Classical Memory Store (`MS`), Add (`M+`), and Recall (`MR`)
- **Actor**: `ACT-USER-STD`
- **Preconditions**: Memory register empty (`MC`).
- **Action Sequence / Input**:
  1. User enters `100`, presses `MS` (Memory indicator `M` turns active).
  2. User enters `50`, presses `M+`.
  3. User clears display, presses `MR`.
- **Expected Outcome**: Display shows `150`. User reloads page and presses `MR`; display still shows `150`.
- **Enforces**: `RULE-HIST-03`

### `CASE-HIST-04`: CSV Export Formatting
- **Actor**: `ACT-USER-FIN`
- **Preconditions**: History contains 2 items:
  1. `1000 + 500 = 1500` (Annotated: "Bonus payment")
  2. `200 * 5 = 1000` (No annotation)
- **Action Sequence / Input**: User clicks "Export CSV".
- **Expected Outcome**: Generates RFC 4180 CSV file with proper headers, quotes, and escaped commas for annotations.
- **Enforces**: `RULE-HIST-04`

### `CASE-HIST-05`: Destructive Clear with Confirmation Guard
- **Actor**: `ACT-USER-STD`
- **Preconditions**: History populated with items.
- **Action Sequence / Input**: User clicks Trash icon, cancels dialog $\implies$ items preserved. User clicks Trash icon, confirms dialog $\implies$ items purged.
- **Expected Outcome**: Confirmation modal prevents accidental data loss; confirm clears IndexedDB records.
- **Enforces**: `NEVER-HIST-01`

## 2. Traceability Matrix

| Rule / Invariant ID | Flow Decision | Case ID | Test Category | Target Test File |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-HIST-01` | `DEC-HIST-01` | `CASE-HIST-01` | Persistence | `tests/unit/history-tape.test.ts` |
| `NEVER-HIST-02` | `DEC-HIST-01` | `CASE-HIST-01` | Storage Integrity | `tests/unit/history-tape.test.ts` |
| `RULE-HIST-02` | `DEC-HIST-01` | `CASE-HIST-02` | Clear Boundary | `tests/unit/history-tape.test.ts` |
| `RULE-HIST-03` | `DEC-HIST-01` | `CASE-HIST-03` | Memory Registers | `tests/unit/memory-registers.test.ts` |
| `RULE-HIST-04` | `DEC-HIST-01` | `CASE-HIST-04` | Export Format | `tests/unit/history-export.test.ts` |
| `NEVER-HIST-01` | `DEC-HIST-02` | `CASE-HIST-05` | Destructive Guard | `tests/unit/history-tape.test.ts` |

## 3. Cases N/A Declarations
- **Late Webhook Replay**: N/A (Client-only local storage).

## 4. Unhandled Stall Checklist
- [x] Clear History requires explicit confirmation dialog before deletion.
- [x] Memory registers survive browser navigation and page refreshes.
- [x] Export formats conform to RFC 4180 standard.

## 5. References
- [Feature Specification](./feature.md)
- [User Flow & Decision Trees](./flow.md)
