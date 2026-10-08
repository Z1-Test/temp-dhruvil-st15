---
type: Architecture
title: "Universal Calculator System Architecture"
description: "Macro system topology, component boundaries, runtime dependencies, AST mathematical pipeline, and security boundaries for the Universal Calculator application."
status: stable
tags: [architecture, topology, system, okf-v0.2, calculator]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/vision.md
  - resource: docs/context/project/tech.md
---

# Universal Calculator System Architecture

## 1. Overview & Architectural Blueprint

The Universal Calculator is built upon a **Decoupled Engine & Reactive Surface** pattern. The computational core operates as an isolated, side-effect-free mathematical engine, while the presentation surface handles input capture, layout adaptation, accessibility announcements, and reactive visualization.

```mermaid
flowchart TD
  subgraph Input_and_Interaction ["Input & Presentation Tier"]
    KB["Hardware Keyboard / Numpad Handler"]
    TOUCH["Touchscreen & Mouse Numpad Grid"]
    VOICE["Accessibility Screen Reader / Aria Live"]
    DISPLAY["Dual-Line Formula & Result Display"]
    TAPE_UI["Interactive History Tape Drawer"]
    GRAPH_CANVAS["2D Cartesian Graph Canvas"]
  end

  subgraph State_and_Orchestration ["State & Orchestration Tier"]
    STATE_MGR["Calculator State Machine (Active Tokens, Cursor, Mode)"]
    MEM_STORE["Memory Register Store (M+, M-, MR, MC, MS, M1..Mn)"]
    HIST_STORE["Audit History Store (IndexedDB / Local Storage)"]
    CONFIG_STORE["Settings & Locale Store (Theme, Precision, Angle Mode)"]
  end

  subgraph Engine_Pipeline ["Mathematical Pipeline Tier (Pure / Zero UI)"]
    LEXER["Lexical Analyzer & Tokenizer"]
    PARSER["AST & RPN Parser (Dijkstra Shunting-Yard)"]
    VALIDATOR["Domain Validator (Parentheses match, syntax integrity)"]
    EVALUATOR["Evaluator Dispatcher"]
  end

  subgraph Domain_Evaluators ["Domain Computation Subsystems"]
    STD_EVAL["Standard Arithmetic & Decimal Evaluator"]
    SCI_EVAL["Scientific & Trigonometric Evaluator"]
    PROG_EVAL["Programmer Radix & Bitwise Engine"]
    FIN_EVAL["Financial TVM & Loan Amortization Engine"]
    CONV_EVAL["Unit & Currency Dimensional Conversion Engine"]
    GRAPH_EVAL["Parametric & Function Sampling Generator"]
  end

  KB --> STATE_MGR
  TOUCH --> STATE_MGR
  STATE_MGR --> DISPLAY
  STATE_MGR --> LEXER
  
  LEXER --> VALIDATOR
  VALIDATOR --> PARSER
  PARSER --> EVALUATOR

  EVALUATOR --> STD_EVAL
  EVALUATOR --> SCI_EVAL
  EVALUATOR --> PROG_EVAL
  EVALUATOR --> FIN_EVAL
  EVALUATOR --> CONV_EVAL
  EVALUATOR --> GRAPH_EVAL

  STD_EVAL --> STATE_MGR
  SCI_EVAL --> STATE_MGR
  PROG_EVAL --> STATE_MGR
  FIN_EVAL --> STATE_MGR
  CONV_EVAL --> STATE_MGR
  GRAPH_EVAL --> GRAPH_CANVAS

  STATE_MGR --> HIST_STORE
  STATE_MGR --> MEM_STORE
  HIST_STORE --> TAPE_UI
```

---

## 2. Component Boundaries & Responsibilities

### 2.1. Presentation & Input Tier
- **Display Component**: Renders the multi-line interface:
  - Top expression line: Displays the complete mathematical formula with syntax highlighting (operands in cyan, operators in amber, parentheses matched with subtle colors).
  - Bottom result line: Displays the live evaluation preview as the user types, transitioning to confirmed result on pressing `=` or `Enter`.
- **Keypad Matrix Component**: Dynamically adapts to active mode (Standard 4x5 grid, Scientific 6x6 expanded grid, Programmer bitfield grid).
- **Accessibility Engine**: Manages `aria-live="polite"` regions so screen readers verbalize results, errors, and mode transitions without latency.

### 2.2. State & Orchestration Tier
- **Calculator State Machine**: Manages the current expression buffer, cursor position, selected angle mode (`DEG` | `RAD` | `GRAD`), base mode (`HEX` | `DEC` | `OCT` | `BIN`), and active word size (`8`, `16`, `32`, `64` bits).
- **Memory Store**: Maintains persistent memory registers (`M+`, `M-`, `MR`, `MC`, `MS`) and multi-slot named registers (`M1`, `M2`, `M3`).
- **History Tape Store**: Appends immutable records of committed calculations with timestamps, raw expression, evaluated result, and optional user annotations.

### 2.3. Mathematical Pipeline Tier
- **Lexer**: Converts raw character streams into typed mathematical tokens:
  - `NUMBER`, `OPERATOR_BINARY`, `OPERATOR_UNARY`, `FUNCTION`, `LPAREN`, `RPAREN`, `CONSTANT`, `COMMA`.
- **Parser (Shunting-Yard Algorithm)**: Converts infix token stream into either:
  1. Reverse Polish Notation (RPN) queue for stack-based execution.
  2. Abstract Syntax Tree (AST) for symbolic verification and graphing.
- **Precision Evaluator**: Executes operations using an arbitrary-precision decimal representation (e.g., 34–100 decimal digits) to completely prevent IEEE 754 floating-point inaccuracies.

---

## 3. Mathematical Evaluation Pipeline Detail

```mermaid
sequenceDiagram
  autonumber
  actor User
  participant UI as Display & Keypad
  participant State as State Machine
  participant Engine as Engine Pipeline
  participant Domain as Domain Evaluator
  participant Tape as History Tape

  User->>UI: Types "15 + 20 * (3 - 1)"
  UI->>State: pushToken("15"), pushToken("+")...
  State->>Engine: evaluateExpression("15 + 20 * (3 - 1)")
  Engine->>Engine: Lexical Tokenization
  Engine->>Engine: Syntax Validation (Check parenthesis parity)
  Engine->>Engine: Shunting-Yard AST Generation
  Engine->>Domain: Evaluate AST with Decimal Precision
  Domain-->>Engine: Decimal("55")
  Engine-->>State: Result preview = "55"
  State-->>UI: Update bottom line preview ("55")
  User->>UI: Presses "=" (Commit)
  UI->>State: commitCalculation()
  State->>Tape: recordEntry({ expr: "15 + 20 * (3 - 1)", result: "55", ts: ... })
  State-->>UI: Freeze result as primary accumulator
```

---

## 4. Security & Safety Boundaries

1. **Strict Zero-Eval Policy**:
   - The application **NEVER** uses JavaScript's `eval()`, `new Function()`, or dynamic script execution. All mathematical parsing is performed through a deterministic, hand-written recursive descent or Shunting-Yard parser.
   - Prevents code injection, prototype pollution, and arbitrary script execution.
2. **Infinite Recursion & DOS Fencing**:
   - Expression length capped at 4,096 tokens per formula.
   - Factorial operations capped at $n \le 10,000$ to prevent CPU freeze.
   - Graph sampling limited to 2,000 coordinate points per frame with rendering offloaded to requestAnimationFrame / Web Worker.
3. **Local Storage Sandboxing**:
   - All history data is saved locally in browser IndexedDB or native sandboxed storage. No sensitive computation data leaves the client sandbox.

---

## 5. Architectural References

- [Product Vision](./vision.md)
- [Technology Stack Strategy](./tech.md)
- [Domain Rules & Mathematical Invariants](./domain-rules.md)
- [Mathematical Terminology Glossary](./glossary.md)
- [Target Actors & User Personas](./actors.md)
