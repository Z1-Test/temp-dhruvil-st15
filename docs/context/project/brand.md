---
type: Concept
title: "Universal Calculator Brand Guidelines"
description: "Canonical brand identity, voice, tone, logo rules, and core color values for Universal Calculator."
status: stable
tags: [brand, identity, voice, tone, colors]
brand_colors:
  primary: "#0284c7"
  primary_active: "#0369a1"
  secondary: "#334155"
  accent: "#16a34a"
  canvas: "#0f172a"
  canvas_dark: "#020617"
  surface: "#1e293b"
  surface_dark: "#0f172a"
  text: "#f8fafc"
  text_dark: "#ffffff"
  muted: "#94a3b8"
  hairline: "#334155"
---

# Brand Guidelines: Universal Calculator

> The single source of truth for brand personality, tone of voice, visual identity rules, and core brand color values.

## 1. Brand Essence & Mission
- **Name**: Universal Calculator
- **Mission**: Deliver mathematically exact, sub-millisecond computation across everyday arithmetic, scientific formulas, programmer bitfields, and financial planning through an accessible, zero-latency desktop and web interface.
- **Target Audience**: Everyday consumers, STEM students and researchers, software engineers, and financial analysts requiring deterministic mathematical accuracy without cloud latency.
- **Brand Personality**: Deterministic, rigorous, accessible, ergonomic, uncluttered, and precise.

## 2. Voice & Tone Architecture
- **Voice Pillars**:
  - **Empirical & Truthful**: State mathematical results and domain errors directly without anthropomorphic hedging or machine approximations.
  - **Quietly Confident**: Present capabilities cleanly with immediate standard controls and progressive disclosure for advanced modes.
  - **Ergonomically Transparent**: Provide tactile and visual cues on every keystroke, ensuring keyboard parity and screen-reader accessibility.
- **Banned Words**: Approximate, roughly, magic, AI-powered calculation, guess, hallucination, intuitive guess, floating drift.
- **Signature Motto**: "Exact calculation without approximation."

## 3. Logo & Visual Identity Rules
- **Primary Mark**: A balanced dual-line glyph combining an exact equivalence sign (`=`) overlapping an abstract mathematical radical and coordinate grid in vibrant sky blue (`#0284c7`).
- **Clear Space**: Always maintain a buffer zone equal to 50% of the logo's height on all four sides.
- **Prohibitions**: Never rotate, skew, recolor, add drop shadows, or place the mark on low-contrast backgrounds that violate WCAG 2.2 AA.

## 4. Core Brand Palette & Values
Palette values live only in the `brand_colors` YAML frontmatter above. Do not copy them into a markdown table. `stayplan-brand` sync writes each mapped key into `docs/context/project/design.md` as an `sl-*` color with Staylook syntax `var(--sl-*, <hex>)`. `primary_active`, `accent`, and the `*_dark` keys stay in this frontmatter.

## 5. Imagery & Asset Direction
- Visuals must emphasize crisp geometric clarity, high-contrast numeric displays, and tactile keypads.
- Graphs and Cartesian curves must use pure, distinct spectral lines on neutral slate backgrounds.
- Avoid skeuomorphic plastic calculator textures; use clean, flat logical planes with hairline borders.
