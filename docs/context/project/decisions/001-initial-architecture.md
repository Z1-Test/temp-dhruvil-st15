---
type: Decision
title: "Decision: Decoupling Core Math Engine from UI Presentation Layer"
description: "Chosen architectural approach for isolating mathematical evaluation from presentation frameworks via Hexagonal Architecture."
status: stable
tags: [adr, decision, architecture, decoupling]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - id: arch-doc
    resource: docs/context/project/architecture.md
    title: System Architecture
---

# Decision: Decoupling Core Math Engine from UI Presentation Layer

## Context

The target technology stack for the calculator is deliberately flexible. The application must support potential multi-platform targets including Web (PWA), Desktop (Tauri/Electron), and Mobile. Furthermore, mathematical computation is inherently functional, deterministic, and pure, while UI frameworks frequently introduce complex lifecycle states, re-rendering behaviors, and platform-specific bindings. Coupling calculation algorithms directly to UI components leads to brittle code, untestable math logic, and platform lock-in.

## Decision

The core calculation engine will be implemented as a **100% headless, zero-dependency, pure library**. It defines strict TypeScript interfaces (`IEngineEvaluator`, `ITapeRecorder`, `IMemoryManager`) acting as ports. UI frameworks (React, Svelte, Web Components, or native shells) interact with the engine exclusively through these ports as adapters.

## Alternatives

- **Option A (chosen)**: Hexagonal decoupled engine. The math engine is pure TypeScript with no DOM, Node.js, or UI dependencies. Maximum reusability, testability, and portability.
- **Option B (rejected)**: UI-coupled state (e.g. React hooks directly embedding math eval). Rejected because it prevents running the engine in Web Workers, CLI runners, or alternative native shells without rewriting.
- **Option C (rejected)**: Heavy microservice architecture (calling an HTTP backend to compute). Rejected because calculators require zero-latency (<1ms) offline calculations.

## Consequences

- The core math engine can be tested with 10,000+ unit test vectors in milliseconds without mounting any DOM or UI components.
- The UI presentation stack can be refactored, modernized, or completely replaced without risking mathematical regressions.
- Enables compiling the math core to WebAssembly or distributing it as a standalone npm package in the future.

## References

- [System Architecture](../architecture.md)
- [Technology Stack Strategy](../tech.md)
