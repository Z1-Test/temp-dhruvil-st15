---
type: Flow
title: "Manage Calculation Tape & Memory User Flow"
status: draft
description: "User interaction logic, tape drawer expansion, note annotation, export flow, and memory recall for History Tape."
tags: [flow, history, tape, memory, user-flow, okf-v0.2]
sources:
  - resource: ./feature.md
---

# User Flow: Manage Calculation Tape & Memory

Authoritative user interaction logic, history drawer navigation, memory register manipulation, annotation editing, and export workflows.

## 1. Flow Overview
- **Goal**: Review past calculations, recall numbers, add annotations, manipulate memory registers, and export records.
- **Primary Surface**: `app/history`
- **Actor Role**: `ACT-USER-STD` / `ACT-USER-FIN`
- **Entry Trigger**: User clicks History Tape icon or accesses Memory tab.
- **Exit Outcome**: Value recalled into display, or history exported to file.

## 2. Entry Points
| Entry ID | Trigger / Source | Preconditions | Initial Surface | Inbound Flow |
| :--- | :--- | :--- | :--- | :--- |
| `ENT-HIST-01` | History icon click | Desktop split drawer or mobile bottom sheet | `SCR-HIST-DRAWER` | `FLW-HIST-01` |
| `ENT-HIST-02` | Memory button click (`MR` / `MS`) | Calculator keypad memory row | `SCR-MEM-BAR` | `FLW-HIST-02` |

## 3. Step-by-Step Decision Logic (`FLW-HIST-01`)

```text
START: [SCR-HIST-DRAWER: Reverse chronological list of calculation cards]
  ↓
[User Action: Interacts with History Card or Toolbar]
  ↓
DEC-HIST-01: Did user click a historical card's expression or result?
  ├── Click Expression → [Restore full expression into active calculator buffer]
  │                      [Close drawer / focus display]
  │                      EXIT: [Expression Restored]
  │
  ├── Click Result     → [Append result value as operand into current formula]
  │                      [Copy result value to system clipboard]
  │                      EXIT: [Result Recalled]
  │
  ├── Click "Add Note" (Annotation icon)
  │     ↓
  │    [Open inline text field on card]
  │    [User types custom note: e.g. "Conference flight ticket"]
  │    [Save note to IndexedDB record]
  │    EXIT: [Annotation Saved]
  │
  ├── Click "Export" (CSV / JSON / TXT)
  │     ↓
  │    [Format all filtered entries into requested format]
  │    [Trigger browser file download: "calculator-history-YYYY-MM-DD.csv"]
  │    EXIT: [File Downloaded]
  │
  └── Click "Clear History" (Trash icon)
        ↓
       [Display confirmation modal: "Delete all history entries? This cannot be undone."]
       DEC-HIST-02: User confirms?
            ├── NO  → (Dismiss modal, keep records intact)
            └── YES → [Purge records from IndexedDB]
                      [Render empty state: "No calculation history yet"]
                      EXIT: [History Cleared]
```

## 4. Error Recovery & Stalls
- `REC-HIST-01`: Accidental clear is prevented by requiring explicit two-step confirmation before executing the destructive purge.

## 5. References
- [Feature Specification](./feature.md)
- [Test Cases](./cases.md)
