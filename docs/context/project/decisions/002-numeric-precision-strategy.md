---
type: Decision
title: "Decision: Arbitrary-Precision Decimal Representation vs IEEE-754 Floating Point"
description: "Chosen numeric precision strategy to eliminate binary floating-point drift and guarantee exact arithmetic across all calculator modes."
status: stable
tags: [adr, decision, math, precision]
generated: { by: human:maintainer, at: 2026-10-08T00:00:00Z }
sources:
  - id: domain-rules
    resource: docs/context/project/domain-rules.md
    title: Domain Rules
---

# Decision: Arbitrary-Precision Decimal Representation vs IEEE-754 Floating Point

## Context

Standard hardware floating-point numbers (IEEE 754 64-bit binary float, standard `number` in JavaScript) represent fractions in binary powers of 2. Decimal fractions such as `0.1` and `0.2` cannot be represented exactly in binary, resulting in notorious rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`). In financial, accounting, and basic arithmetic contexts, users find such drift unacceptable and consider it an application defect.

## Decision

All standard, financial, and unit conversion calculations will be computed using an **arbitrary-precision decimal arithmetic engine** (configured to 34–64 decimal places of internal precision, with configurable display rounding). Native binary floats will be restricted exclusively to high-throughput graphics sampling for 2D curve plotting where hardware performance is critical.

## Alternatives

- **Option A (chosen)**: Arbitrary-precision decimal representation (e.g. using `decimal.js` or equivalent fixed-point BigInt logic). Guarantees absolute decimal precision and exact base-10 rounding.
- **Option B (rejected)**: Native IEEE 754 `number` with `toFixed()` / epsilon rounding heuristics. Rejected because heuristics fail on compounding calculations and large exponent values.
- **Option C (rejected)**: Native JavaScript `BigInt` alone. Rejected because `BigInt` only supports integers and truncates fractional division.

## Consequences

- Calculations like `0.1 + 0.2` evaluate to exactly `0.3`.
- Financial interest calculations and loan amortization schedules remain bit-for-bit accurate to the nearest cent without accumulated rounding drift.
- Slight computation overhead (measured in microseconds per keystroke), which is completely imperceptible to human users.

## References

- [Domain Rules](../domain-rules.md)
- [System Architecture](../architecture.md)
