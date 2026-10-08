---
type: Glossary
title: "Universal Calculator Mathematical & Technical Glossary"
description: "Authoritative terminology and domain definitions for calculator architecture, mathematical logic, and computing paradigms."
status: stable
tags: [glossary, domain, math, terminology]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/vision.md
---

# Universal Calculator Mathematical & Technical Glossary

| Term | Domain | Definition |
| :--- | :--- | :--- |
| **AST (Abstract Syntax Tree)** | Parsing | A tree representation of the abstract syntactic structure of a mathematical expression where interior nodes represent operators and leaves represent operands. |
| **Shunting-Yard Algorithm** | Parsing | A classical algorithm invented by Edsger Dijkstra that parses infix expressions into Reverse Polish Notation (RPN) or an AST using an operator stack and output queue. |
| **BODMAS / PEMDAS** | Arithmetic | Standard operator precedence hierarchy: Brackets/Parentheses, Orders/Exponents, Division/Multiplication (left-to-right), Addition/Subtraction (left-to-right). |
| **Arbitrary-Precision Arithmetic** | Numeric Core | Numerical calculation where digits of precision are bounded only by system memory rather than fixed machine hardware registers (e.g. IEEE 754 64-bit float). |
| **IEEE 754 Floating Point** | Computer Science | The standard binary representation for real numbers in hardware, notorious for binary fractional approximations such as `0.1 + 0.2 = 0.30000000000000004`. |
| **Two's Complement** | Programmer Mode | A mathematical operation on binary numbers used as the predominant method of representing signed integers in computing. |
| **Word Size (QWORD / DWORD / WORD / BYTE)** | Programmer Mode | The fixed bit-width of an integer register: QWORD (64 bits), DWORD (32 bits), WORD (16 bits), BYTE (8 bits). |
| **Bitwise Operations** | Programmer Mode | Operations that manipulate individual bits directly: AND, OR, XOR, NOT, NAND, NOR, XNOR. |
| **Bit Shifts & Rotates** | Programmer Mode | Bit-level positional displacements: Logical Shift (LSL, LSR), Arithmetic Shift (ASR preserves sign), and Circular Rotations (ROL, ROR). |
| **Radix (Base)** | Number Systems | The number of unique digits representing numbers: Binary (base 2), Octal (base 8), Decimal (base 10), Hexadecimal (base 16). |
| **DEG / RAD / GRAD** | Scientific Mode | Angular measurement units: Degrees ($360^\circ$ circle), Radians ($2\pi$ circle), and Gradians (400 gon circle). |
| **TVM (Time Value of Money)** | Financial Mode | Financial framework relating Present Value (PV), Future Value (FV), Periodic Payment (PMT), Number of Periods (N), and Interest Rate (I/Y). |
| **Amortization** | Financial Mode | The systematic repayment of a loan over time through scheduled periodic installments (EMI), dividing payments between principal and accrued interest. |
| **Calculation Tape** | State / UX | A persistent sequential log documenting each evaluated calculation, containing expression, result, timestamp, and optional user annotations. |
| **Memory Registers (M+, M-, MR, MC, MS)** | Arithmetic Core | Classical calculator memory operations: Memory Add (`M+`), Memory Subtract (`M-`), Memory Recall (`MR`), Memory Clear (`MC`), and Memory Store (`MS`). |
