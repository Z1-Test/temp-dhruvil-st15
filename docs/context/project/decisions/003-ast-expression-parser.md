---
type: Decision
title: "Decision: AST-Based Expression Evaluation via Shunting-Yard Parser"
description: "Chosen parsing methodology for infix expression evaluation over immediate-execution accumulators and dynamic eval."
status: stable
tags: [adr, decision, parser, ast]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - id: arch-doc
    resource: docs/context/project/architecture.md
    title: System Architecture
---

# Decision: AST-Based Expression Evaluation via Shunting-Yard Parser

## Context

Calculators historically operate in one of two paradigms:
1. **Immediate Execution Mode**: Each operator immediately evaluates the previous pair (e.g. `2 + 3 * 4` evaluates `2 + 3 = 5`, then `5 * 4 = 20`, violating mathematical order of operations).
2. **Formula / Expression Mode**: The user inputs an entire mathematical expression, which is parsed according to operator precedence (BODMAS / PEMDAS), producing `2 + 3 * 4 = 14`.

The project requires support for complex nested expressions, parentheses, scientific functions, and real-time live preview.

## Decision

The application will implement a **two-phase Lexer and Shunting-Yard AST Parser**:
1. **Lexer**: Tokenizes raw character stream into typed tokens (`NUMBER`, `OPERATOR`, `FUNCTION`, `LPAREN`, `RPAREN`).
2. **Parser**: Implements Edsger Dijkstra's Shunting-Yard Algorithm to generate an Abstract Syntax Tree (AST) and Reverse Polish Notation (RPN) queue.
3. **Evaluator**: Recursively evaluates the AST using the arbitrary-precision decimal engine.

## Alternatives

- **Option A (chosen)**: Hand-crafted Lexer + Shunting-Yard Parser. Fully auditable, zero external dependencies, total control over error reporting and syntax highlighting tokens, zero security vulnerability.
- **Option B (rejected)**: Native `eval()` or `Function()`. Strictly rejected due to severe security risks (XSS / code injection) and lack of decimal precision control.
- **Option C (rejected)**: Traditional immediate execution accumulator. Rejected because modern users expect algebraic precedence and multi-term formula visibility.

## Consequences

- Full algebraic operator precedence (BODMAS/PEMDAS) is guaranteed.
- Expressions can be syntax-highlighted in real time based on lexical token types.
- Auto-balancing of trailing unclosed parentheses can be performed automatically prior to evaluation.

## References

- [System Architecture](../architecture.md)
- [Universal Calculator Glossary](../glossary.md)
