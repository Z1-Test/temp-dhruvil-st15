---
type: Feature
title: "Manage Persistent Calculation Tape & Memory Registers"
status: draft
description: "Authoritative product problem, rules, boundary invariants, scope, and survivability matrix for History Tape and Memory Registers."
tags: [feature, history, tape, memory, persistence, okf-v0.2]
sources:
  - resource: ../../../project/vision.md
  - resource: ../../../project/domain-rules.md
  - resource: ../../../project/actors.md
---

# Feature: Manage Persistent Calculation Tape & Memory Registers

Authoritative product specification for persistent calculation audit tape, custom item annotations, export mechanisms (CSV, JSON, TXT), search filtering, and classical/multi-slot memory registers (MC, MR, M+, M-, MS).

## 1. Problem, Actors & Outcome
- **Problem & Context**: Users working through multi-step calculations frequently lose track of previous numbers or make transcription errors when copying results by hand. Traditional calculators offer only a single volatile memory register and wipe all history upon clear (`C`/`AC`) or window refresh.
- **Target Actors & Roles**:
  | Role / Persona | Surface | Arrival State / Prerequisite | Permissions & Access |
  | :--- | :--- | :--- | :--- |
  | `ACT-USER-STD` | `app/history` | Reviewing grocery receipts or personal budget totals | Full history audit & export |
  | `ACT-USER-FIN` | `app/history` | Compiling financial expense breakdowns | Custom labeling & CSV export |
  | `ACT-USER-STEM` | `app/history` | Recalling past constants or formula outputs | Multi-slot memory access |
- **Checkable Success ("This Worked")**: Every committed calculation appends to an audit tape log; clicking any historical record recalls the value into active calculation; users can add notes/annotations; memory buttons (`MC`, `MR`, `M+`, `M-`, `MS`) manage persistent registers; history exports to CSV/JSON.
- **Checkable Failure ("This Is Broken")**: Calculations vanish upon page refresh or app restart; clearing history occurs accidentally without confirmation.

## 2. Scope & Boundary Invariants
- **In This Revision**:
  - Calculation Tape Audit Log:
    - Chronological list of calculations with timestamp, mode badge, expression, and result.
    - Click-to-recall: Clicking expression re-populates active editor; clicking result copies to clipboard or appends as operand.
    - Custom annotations: Inline text notes attached to tape entries (e.g. "Rent", "Groceries").
    - Search & filter: Real-time text search across expressions, results, and notes.
    - History export: Download full history as CSV, JSON, or plain text.
    - Clear history action with confirmation dialog.
  - Memory Registers:
    - Primary register: `MC` (Clear), `MR` (Recall), `M+` (Add current value), `M-` (Subtract current value), `MS` (Store current value).
    - Multi-slot register drawer: Named slots `M1`, `M2`, `M3`, `M4` with live preview.
- **Refused / Owned Elsewhere**:
  - Cloud server backup and cross-device sync are deferred to Phase 2. All storage is local.
- **Underlying Product Rules (Screen-Agnostic Truths)**:
  - `RULE-HIST-01`: Every calculation committed via `=` must append an immutable record to the local persistent store (IndexedDB).
  - `RULE-HIST-02`: Pressing `AC` clears only the active display and accumulator; it must **NEVER** wipe the History Tape.
  - `RULE-HIST-03`: Memory registers (`M+`, `M-`, `MS`) persist across browser reloads until explicitly cleared via `MC`.
  - `RULE-HIST-04`: Exporting data generates standardized RFC 4180 compliant CSV files with headers `id`, `timestamp`, `mode`, `expression`, `result`, `annotation`.
- **What Must Never Happen**:
  - `NEVER-HIST-01`: Never delete or clear the calculation tape without explicit user confirmation.
  - `NEVER-HIST-02`: Never lose historical records during tab close, browser navigation, or device power down.

## 3. Object Lifecycle & Survivability Matrix
| Entity / Object | Identity Model | State | Survives Page Refresh? | Survives App Kill? | Conflict Winner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TapeEntry` | UUIDv4 | Committed | Yes (IndexedDB) | Yes | Last-write |
| `MemoryRegister` | Fixed keys (`primary`, `M1`..`M4`) | Committed | Yes (LocalStorage) | Yes | Last-write |

## 4. Notifications, Auditing & Reporting
- **User Notifications**: Toast message on tape copy, note save, and export generation.
- **Audit Logging**: Tape serves as the immutable audit log for the application.

## 5. Cross-Feature Seams (`SEAM-*`)
| Seam ID | Source Slice | Destination Slice | Arrival Payload | Handoff Payload | Failure Owner | Related RULE / NEVER |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEAM-HIST-01` | `standard/evaluate-arithmetic` | `history/manage-calculation-tape` | `{ expression, result, mode }` | Confirmed entry ID | destination | `RULE-HIST-01` |
| `SEAM-HIST-02` | `history/manage-calculation-tape` | `standard/evaluate-arithmetic` | `{ selectedResult }` | Re-injected operand | destination | `RULE-HIST-01` |

## 6. References
- [User Flow](./flow.md)
- [Test Cases](./cases.md)
