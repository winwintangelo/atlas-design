# 03 · Design system

Exact values live in `tokens/tokens.json` and `tokens/tokens.css`. This page explains how to use them. The owner said: *"I really like current design system and look and feels, please keep consistency."* Treat this page as locked.

## Personality

Night city, black glass, light at the edges. Precise and engineered, never playful. The drama comes from **light, depth and motion**, not decoration. Text is small, crisp and dense. Numbers are monospaced.

## Color

### Surfaces
| Token | Value | Use |
|---|---|---|
| `bg.void` | `#02050a` | App root and 3D scene |
| `panel.fill` | `rgba(2,7,13,.70)` Cinematic / `.90` Operational | All floating panels (backdrop blur 6 px allowed) |
| `panel.borderCyan` | `rgba(86,214,255,.22)` | Explorer, camera bar, replay bar |
| `panel.borderWhite` | `rgba(242,251,255,.30)` | Inspector: the "evidence" surface is white-edged |
| `bg.code` | `rgba(1,4,9,.85)` | Payload viewer well |

### Ink
| Token | Value | Contrast on `bg.void` | Use |
|---|---|---|---|
| `ink.strong` | `#f2fbff` | 19.5:1 | Selected ids, big numbers |
| `ink.primary` | `#e9f2fb` | 18:1 | Default text |
| `ink.body` | `#d3e1ee` | 15.3:1 | Dense body text |
| `ink.secondary` | `#a9bccd` | 10.5:1 | Secondary lines |
| `ink.tertiary` | `#7d93a8` | 6.4:1 | Section labels, captions |
| `ink.muted` | `#6f859b` | 5.4:1 | Punctuation, placeholders only |
| `ink.disabled` | `#4c5f72` | 3.1:1 | Not-yet-reached rows. Never the only cue |

### Semantic colors (fixed meaning across the whole product)
| Meaning | Token | Value | Always paired with |
|---|---|---|---|
| The selected transaction / request | `semantic.request` | `#f2fbff` | Glow + thicker stroke |
| Healthy flow, primary accent, focus | `semantic.flow` | `#56d6ff` | Moving dashes |
| Response / return | `semantic.response` | `#7fe1ff` | Direction (moves back to caller) |
| Queue, waiting, degraded, SLO breach | `semantic.degraded` | `#ffb340` | Hatching on bars, "SLOW" badge, ring cars |
| Failure, timeout, evicted | `semantic.failure` | `#ff6b7d` | Spark burst, ✕ scar, status code text |
| Lineage, provenance, control plane | `semantic.lineage` | `#b69bff` | Dashed line |
| Telemetry components | `semantic.telemetry` | `#8fb3d1` | — |

Amber and coral differ in lightness as well as hue, so they stay distinguishable for color-vision deficiencies. Every state also has a shape or text cue.

## Typography

| Role | Family | Size / weight | Case / tracking | Use |
|---|---|---|---|---|
| Display | Michroma | 10–15 px, 400 | UPPERCASE, 0.12–0.24em | Brand, district names, panel titles, zoom-stop buttons on docs boards |
| UI | Saira | 12–15 px, 300–600 | Sentence case | Descriptions, buttons with words, list metadata |
| Data | JetBrains Mono | 10.5–26 px, 400–700 | — | **Every** id, number, time, function name, payload, axis label, section label |
| Section label | JetBrains Mono | 11 px | UPPERCASE, 0.16em, `ink.tertiary` | `TRANSACTIONS`, `CALLS · CLICK TO JUMP`, `PAYLOAD` |

Load from Google Fonts (URL in tokens). Fallbacks: `system-ui` / `ui-monospace`. Use tabular numbers for all metrics.

## Shape, line and space

- **Radius 0 everywhere.** Exceptions: status dots, pulse rings.
- **Hairlines:** 1 px borders. Selected rows get a white 60% border. Status rows get a 3 px left accent in the status color.
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 18, 24 px. Panel padding 16. Screen gutter 24.
- **Control heights:** 36 px (camera bar, segmented controls), 44 px (play, search), 30 px (chips), 26 px (call rows).
- **Icons:** inline SVG, stroke 1.4 px, `ink.body` color, 16–18 px. No icon fonts, no emoji.

## Components (as in the A2 mockup)

| Component | Anatomy | States |
|---|---|---|
| **Panel** | Fill + 1 px border, 16 px padding, section labels in mono caps | Cinematic 70% / Operational 90% opacity |
| **Segmented control** | Joined 36 px buttons in a 1 px frame | On: `flow` border + 16% `flow` fill + `ink.strong` text |
| **Chip** | 30 px, mono 11.5 px | Same as segmented |
| **Result row** (transaction) | Id + headline latency / meta + status badge / 5 px mini critical-path strip | Selected: white border, 7% white fill. 3 px left edge in status color |
| **Status badge** | Mono 10.5 px, 1 px border in status color: `SLOW`, `OK`, `503`… | — |
| **Stat tile** | Mono value 15–16 px + 11.5 px caption | Breach: amber border + `rgba(40,26,8,.45)` fill. Error: coral border |
| **Call row** | Index · function (ellipsis) · duration | Current: white 2 px left edge + 10% white fill. Not reached: muted text |
| **Payload viewer** | Mono 11.5/17 px, `white-space: pre`, scroll, syntax tokens (`code.*`) | Redacted strings in amber; error tokens in coral |
| **Tabs** | Two 38 px text tabs, 2 px underline | Active underline: white (Transaction), cyan (Integration) |
| **Scene label** | Display caps title (10 px) + mono line (11.5 px) in a dark box with a 1 px tone border; 1 px leader line down to the anchor | Fades by zoom level and viewport |
| **Arc handle** | 10 px rotated square (diamond) in a 28 px hit target, at the arc midpoint | Selected: `flow` fill + white border |
| **Call bubble** | Dark box, 3 px left edge in state color: `→ function` / state line | Flips left when near the inspector |
| **Pulse ring** | 46 px circle, 2 px border, scale 0.6 → 1.9, fade out over 1.3 s | White ok / coral fail |

## Motion

| Token | Value | Use |
|---|---|---|
| `motion.flight` + `easeFlight` | 1100 ms, `cubic-bezier(.7,0,.2,1)` | Zoom-stop flights; labels follow with the same curve |
| `motion.quick` | 300 ms | Zoom ± buttons |
| `motion.orbitStep` | 240 ms | Orbit/tilt buttons (eased) |
| `motion.pulse` | 1.2 s | Active building glow |
| `motion.ring` | 1.3 s ease-out | Callee pulse ring |
| `motion.replayTrack` | 16 s at 1× | Full replay timeline |
| `motion.flowDash` | `clamp(1.6, 9 − 1.6·log10(rate), 9)` s | Idle arc dash cycle: busier = faster |

`prefers-reduced-motion`: no flights (cut), no dash flow, no pulses, no motes. Replay steps call-to-call instead of animating.

## Intensity modes

| Parameter | Operational | Cinematic |
|---|---|---|
| Bloom | Low (edges only) | High (halos on edges, arcs, packets) |
| Haze, vignette, motes, light beam over active node | Off | On |
| Horizon glow | 0.35 | 0.9 |
| Grid opacity near / far | 0.12 / 0.04 | 0.20 / 0.07 |
| Panel opacity | 90% | 70% |
| Window brightness | 0.8× | 1.0× |
| Idle camera drift | Off | Optional, ≤ 0.5°/s, stops on any input |

**Never changes:** values, positions, which items are visible, color meanings, labels.

## Don'ts

No rounded corners, gradient washes, emoji, glassmorphism blobs, drop-shadow cards, rainbow palettes, decorative numbers, fake status bars, or film UI, logos or typefaces copied from the referenced films.
