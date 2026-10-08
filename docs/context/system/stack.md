---
type: Stack
title: "Universal Calculator System Stack Specification"
description: "Core interfaces, subsystem contracts, and technology options for the Universal Calculator system layers."
status: stable
tags: [stack, system, interfaces, layers]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - resource: docs/context/project/tech.md
  - resource: docs/context/project/architecture.md
---

# Universal Calculator System Stack Specification

## 1. Subsystem Layer Contracts

The calculator is composed of four strictly layered tiers. Each tier communicates with adjacent tiers exclusively through typed TypeScript interfaces:

```text
[ Presentation Layer: Web / Desktop / Mobile ]
                     │ (UI Events: keypress, mode switch)
                     ▼
[ State & Orchestration Layer: CalculatorStateMachine ]
                     │ (Tokens, Expression Strings)
                     ▼
[ Mathematical Pipeline: Lexer -> Parser -> Evaluator ]
                     │ (Numeric Operations)
                     ▼
[ Numeric Core: Arbitrary Precision Decimal Engine ]
```

---

## 2. Core Engine Port Interfaces

The presentation layer depends only on the following stable interface contracts:

```typescript
export interface IEngineEvaluator {
  /**
   * Tokenizes, parses, and evaluates an infix mathematical expression string.
   * Returns a structured calculation result with full precision and formatted string.
   */
  evaluate(expression: string, context: EvaluationContext): CalculationResult;
  
  /**
   * Evaluates expression syntax in real time without throwing, returning preview value.
   */
  preview(expression: string, context: EvaluationContext): CalculationPreview;
}

export interface EvaluationContext {
  angleMode: "DEG" | "RAD" | "GRAD";
  baseMode: "HEX" | "DEC" | "OCT" | "BIN";
  wordSize: 8 | 16 | 32 | 64;
  precision: number;
}

export interface IMemoryManager {
  memoryAdd(value: string): void;
  memorySubtract(value: string): void;
  memoryRecall(): string;
  memoryClear(): void;
  memoryStore(value: string): void;
  hasValue(): boolean;
}

export interface ITapeRecorder {
  record(entry: TapeEntry): Promise<void>;
  listEntries(limit?: number): Promise<TapeEntry[]>;
  updateAnnotation(id: string, note: string): Promise<void>;
  clearHistory(): Promise<void>;
  exportData(format: "csv" | "json" | "txt"): Promise<string>;
}

export interface TapeEntry {
  id: string;
  timestamp: string;
  expression: string;
  result: string;
  mode: "standard" | "scientific" | "programmer" | "financial";
  annotation?: string;
}
```

---

## 3. Technology Stack Candidate Comparison

Because the technology stack is intentionally not fixed at this stage, the project defines clear selection criteria:

| Target Platform | Primary Candidate | Secondary Candidate | Justification |
| :--- | :--- | :--- | :--- |
| **Web Presentation** | Vite + TypeScript + React / Svelte | Vanilla Web Components | Instant hot-module replacement, high component ecosystem, seamless PWA support. |
| **Desktop Presentation** | Tauri v2 (Rust + Webview) | Electron | Tauri provides sub-20MB memory footprint, instant startup, and native system tray integration. |
| **Mobile Presentation** | Progressive Web App (PWA) | Flutter / React Native | PWA enables instant zero-store deployment; Flutter offers native fluid 120Hz gesture physics. |
| **Math Core** | TypeScript + Decimal.js | Rust (WASM) | Pure TypeScript has zero compilation barriers; Rust WASM is available if $10^6$-point graphing is required. |
