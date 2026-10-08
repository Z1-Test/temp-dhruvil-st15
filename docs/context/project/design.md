---
type: Concept
title: "Universal Calculator Design System"
status: draft
tags: [design, staylook, tokens]
version: alpha
name: "Universal Calculator Design System"
description: "A high-precision, dark-mode-first mathematical workbench interface anchored on slate canvases, vibrant sky computational accents, and emerald commit triggers with strict WCAG 2.2 AA contrast compliance and ergonomic keyboard parity."

colors:
  sl-primary: "var(--sl-primary, #0284c7)"
  sl-on-primary: "var(--sl-on-primary, #ffffff)"
  sl-secondary: "var(--sl-secondary, #334155)"
  sl-tertiary: "var(--sl-tertiary, #1e293b)"
  sl-background: "var(--sl-background, #0f172a)"
  sl-surface: "var(--sl-surface, #1e293b)"
  sl-container-high: "var(--sl-container-high, #334155)"
  sl-container-medium: "var(--sl-container-medium, #1e293b)"
  sl-container-low: "var(--sl-container-low, #0f172a)"
  sl-text-primary: "var(--sl-text-primary, #f8fafc)"
  sl-text-secondary: "var(--sl-text-secondary, #94a3b8)"
  sl-outline-low: "var(--sl-outline-low, #334155)"
  sl-info: "var(--sl-info, #0284c7)"
  sl-success: "var(--sl-success, #16a34a)"
  sl-warning: "var(--sl-warning, #f59e0b)"
  sl-error: "var(--sl-error, #ef4444)"
  sl-scrim: "var(--sl-scrim, oklch(0.1 0 0 / 0.8))"

typography:
  display-xl:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.015em
  title-md:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  button-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 14px
  lg: 16px
  xl: 32px
  full: 624.9375rem

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.sl-primary}"
    textColor: "{colors.sl-on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.sl-background}"
    textColor: "{colors.sl-text-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.sl-outline-low}"
    padding: 12px 24px
    height: 48px
  card-surface:
    backgroundColor: "{colors.sl-surface}"
    textColor: "{colors.sl-text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.sl-outline-low}"
    padding: 24px
  text-input:
    backgroundColor: "{colors.sl-background}"
    textColor: "{colors.sl-text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.sl-outline-low}"
    padding: 12px 16px
    height: 48px
  nav-bar:
    backgroundColor: "{colors.sl-background}"
    textColor: "{colors.sl-text-primary}"
    typography: "{typography.body-md}"
    height: 64px
    border: "1px solid {colors.sl-outline-low}"
---

# Universal Calculator Design System

## Overview
A high-velocity, deterministic mathematical workbench interface anchored on clean neutral slate canvases and expressive sky/emerald computational accents. Defines the visual identity, audience expectations, and ergonomic tactile cues of the calculator application.

## Colors
Color names come from Staytoken in `@staytunedllp/staystack`. Color values use Staylook CSS variable syntax `var(--sl-*, <fallback>)` to bind directly to theme variables while providing brand fallback colors. `{colors.sl-primary}` is the primary operator accent. Keypad digits and cards use `{colors.sl-surface}` and `{colors.sl-container-medium}`. Committed calculation actions use `{colors.sl-success}`.

## Typography
Headings and numeric display readouts utilize Plus Jakarta Sans with tight negative letter-spacing for an editorial feel and rapid glyph recognition. Keypad labels and audit tape tables use Inter for tabular figure stability.

## Layout
Layouts follow a 4px baseline grid with standard container constraints:
- Mobile: 16px side gutters, stacked single-column keypad and display.
- Desktop: Centered 360px compact calculator widget, expanding to 720px when the calculation history tape is toggled open.

## Elevation & Depth
Depth is created primarily through crisp subtle hairline borders (`1px solid {colors.sl-outline-low}`) and dark slate elevation layers (`{colors.sl-surface}` over `{colors.sl-background}`) with soft ambient shadow `rgba(0, 0, 0, 0.5)` rather than blurry artificial glows.

## Shapes
All primary and secondary buttons are strictly pill-shaped (`{rounded.full}`, Staytoken `--sl-radius-9999` at 624.9375rem). The outer calculator container radius is 12px-16px (`{rounded.lg}`).

## Components
- **Buttons**: Pill-shaped action triggers with distinct primary (operator), secondary (digits), action (clear/backspace), and success (equals) color tokens.
- **Display**: High-contrast formula input line with live sub-text calculation preview line and assertive `aria-live` error announcements.
- **Cards**: Calm container surfaces with 16px radius and subtle borders.
- **Inputs**: Form fields with 8px radius and high-contrast focus rings (`{colors.sl-info}`).

## Do's and Don'ts
- **DO** enforce the "One Highlight" rule: maximum 1 primary expressive action per keypad state.
- **DO** maintain pill shape (`rounded: full`) on all action and operator buttons.
- **DON'T** use multi-color gradients, neon glow drop shadows, or unmapped hex codes.
- **DON'T** allow low-contrast color combinations that violate WCAG 2.2 AA (4.5:1 text, 3:1 UI components).
