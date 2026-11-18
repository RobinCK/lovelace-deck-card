# Deck Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Version](https://img.shields.io/github/package-json/v/RobinCK/lovelace-deck-card?label=version&color=blue)](https://github.com/RobinCK/lovelace-deck-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An adaptive **segmented container card** for Home Assistant dashboards.
Group any cards into segments ("pages of a deck") and flip through them:

- 🖥️ **Wide screens** — a segmented **pill bar** with icons, labels, badges and a smoothly sliding active indicator.
- 📱 **Narrow screens** — **swipe** between segments with rubber-band edges + **dot indicators**.

It is **one component with one breakpoint**, not two cards: the segment logic is shared, only the navigation layer adapts.

| Desktop (pills) | Mobile (swipe + dots) |
| --- | --- |
| ![Desktop preview](docs/preview-desktop.png) | ![Mobile preview](docs/preview-mobile.png) |

## Installation

### HACS (recommended)

1. HACS → menu (⋮) → **Custom repositories**
2. Add `https://github.com/RobinCK/lovelace-deck-card` with category **Dashboard**
3. Search for **Deck Card**, install, and reload your browser

### Manual

1. Download `deck-card.js` from the [latest release](https://github.com/RobinCK/lovelace-deck-card/releases)
2. Copy it to `config/www/deck-card.js`
3. Add the resource: **Settings → Dashboards → ⋮ → Resources**
   `/local/deck-card.js`, type **JavaScript module**

## Quick start

```yaml
type: custom:deck-card
segments:
  - name: Overview
    icon: mdi:view-dashboard
    cards:
      - type: weather-forecast
        entity: weather.home
  - name: Zones
    icon: mdi:sprinkler
    badge: 4
    cards:
      - type: entities
        entities:
          - switch.zone_1
          - switch.zone_2
  - name: History
    icon: mdi:chart-line
    cards:
      - type: history-graph
        entities:
          - sensor.soil_moisture
```

That's it — pills on desktop, swipe + dots on the phone, no extra configuration.

## Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | **required** | `custom:deck-card` |
| `segments` | list | **required** | The segments of the deck (see below) |
| `title` | string | — | Optional header above the deck |
| `nav` | string | `auto` | Navigation style: `auto`, `pills`, `dots`, `hidden` |
| `breakpoint` | number | `640` | Viewport width (px) below which `auto` switches to dots + swipe |
| `default_segment` | number/string | `0` | Segment shown on load — 0-based index or segment `name` |
| `remember` | boolean | `false` | Reopen the last active segment on this device |
| `swipe` | boolean | `true` | Touch swiping between segments |
| `animation` | boolean | `true` | Slide/height/indicator animations |
| `min_card_width` | number/string | — | Lay cards out in responsive columns at least this wide (e.g. `340`). Omit for a single column |
| `key` | string | auto | Explicit storage key for `remember` (for identical decks on different views) |

### Segment options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | string | — | Pill label / accessible name |
| `icon` | string | — | Icon shown in the pill, e.g. `mdi:sprinkler` |
| `badge` | string/number | — | Small static counter/text in the pill |
| `cards` | list | `[]` | Any Lovelace cards |
| `min_card_width` | number/string | card-level value | Per-segment override of the responsive column width |

### Multi-column layout

By default a segment stacks its cards in one column. There are two ways to get columns:

#### 1. Native `grid_options` (recommended)

Give cards the same `grid_options.columns` you already use in sections dashboards — deck-card understands it natively (HA itself ignores `grid_options` inside container cards, so deck-card re-implements the sections sizing model):

- every **~350px** of deck width = one virtual dashboard column of **12 units**, so on a 4-column-wide desktop deck `columns: 12` = quarter, `24` = half, `full` = the whole row — exactly like your sections views;
- on narrow screens the unit count shrinks and spans clamp, so everything collapses to a single column automatically;
- **`rows` works like in sections too**: one row ≈ 56px (`--deck-card-row-height`), so `rows: 1` keeps a tile thin even next to a tall graph. Cards without `rows` keep their natural height (deck-card measures them and spans the right number of row tracks automatically);
- cards without `grid_options` default to 12 units wide.

```yaml
type: custom:deck-card
segments:
  - name: Sensors
    icon: mdi:sprout
    cards:
      - type: tile
        entity: sensor.soil_1
        grid_options:
          columns: 12          # quarter of a wide deck, full width on a phone
      - type: custom:mini-graph-card
        entities: [sensor.soil_1]
        grid_options:
          columns: 24          # half
      - type: history-graph
        entities: [sensor.soil_1]
        grid_options:
          columns: full        # whole row
```

#### 2. `min_card_width` (auto-fill)

Alternatively set `min_card_width` (card-level or per segment) and the segment packs as many equal columns as fit, each at least that wide — handy when you don't want to size cards individually. In this mode `deck_span: full` (or `deck_span: N`) on a card takes the whole row / N columns; the hint is consumed by deck-card and never reaches the child card. `min_card_width` takes precedence over `grid_options` within a segment.

### Navigation modes

- **`auto`** *(default)* — pills on wide viewports, dots on narrow ones. One adaptive component, one breakpoint.
- **`pills`** — always show the pill bar (it scrolls horizontally when it overflows, keeping the active pill centered).
- **`dots`** — always show dots.
- **`hidden`** — no navigation at all: pure swipe (kiosk/minimal setups).

## UX details

- **Swipe** follows your finger 1:1, with rubber-band resistance at the first/last segment. Release past ~20% of the width — or flick — to advance; anything less snaps back.
- Swiping never triggers taps on the cards underneath, and gestures that start on sliders, maps or input fields are left alone.
- Vertical scrolling is never hijacked — only clearly horizontal gestures switch segments.
- The container **animates its height** to the active segment, so cards below the deck don't jump.
- **Keyboard**: focus the pill bar / dots and use `←` `→` `Home` `End`. Proper `tablist`/`tab`/`tabpanel` semantics for screen readers; inactive segments are `inert`.
- **Reduced motion**: all animations are disabled automatically when the OS asks for it (`prefers-reduced-motion`), or via `animation: false`.
- Switching segments emits a light **haptic** tick in the HA companion app.

## Visual editor

The card comes with a full UI editor:

- **segments as tabs** — switch, add (＋), rename, reorder and delete segments without touching YAML;
- **per-card layout controls** — width in units, height in rows and a full-width toggle on every card (writes standard `grid_options`);
- **native card editing** — every card opens in the same built-in HA card editor (GUI or YAML) you use everywhere else, and new cards are added through the standard card picker;
- card reordering and deletion per segment.

## Theming

Fine-tune the look with CSS variables (e.g. via [card-mod](https://github.com/thomasloven/lovelace-card-mod) or a theme):

| Variable | Default | Description |
| --- | --- | --- |
| `--deck-card-gap` | `8px` | Gap between cards in a segment |
| `--deck-card-row-height` | `56px` | Height of one `grid_options.rows` unit |
| `--deck-card-duration` | `250ms` | Animation duration |
| `--deck-card-easing` | `cubic-bezier(0.19, 1, 0.22, 1)` | Animation easing |
| `--deck-card-nav-background` | `var(--secondary-background-color)` | Pill bar background |
| `--deck-card-nav-border-radius` | `999px` | Pill bar radius |
| `--deck-card-pill-color` | `var(--secondary-text-color)` | Inactive pill text |
| `--deck-card-pill-active-background` | `var(--primary-color)` | Active pill / indicator background |
| `--deck-card-pill-active-color` | `var(--text-primary-color)` | Active pill text |
| `--deck-card-badge-background` | translucent gray | Pill badge background |
| `--deck-card-dot-color` | `var(--secondary-text-color)` | Inactive dots |
| `--deck-card-dot-active-color` | `var(--primary-color)` | Active dot |

## FAQ

**Why doesn't swiping work over my map/slider?**
By design — cards with their own horizontal gestures (sliders, maps, inputs) keep them. Swipe anywhere else in the segment, or use the navigation.

**Two identical decks on different views fight over `remember`.**
Give each one its own `key: my-deck-1` / `key: my-deck-2`.

**Can I force mobile behaviour everywhere?**
Yes: `nav: dots` (or `hidden` for pure swipe).

## Development

```bash
npm install
npm run build     # bundles src/ → dist/deck-card.js
```

## Other Home Assistant projects

- [Blackout](https://github.com/RobinCK/blackout) — integration for planned and emergency power outages in Ukraine: schedules for 21 regions, the Ukrenergo grid state, outage history and dashboard cards.
- [Sirio Pump Inverter (WiNET)](https://github.com/RobinCK/ha-sirio-winet) — local integration for Italtecnica Sirio pump inverters with the WiNET Wi-Fi module, with a pressure gauge card.
- [Klimo](https://github.com/RobinCK/klimo) — add-on for room-by-room heating and cooling: heat pumps, boilers, air conditioners, heaters and circulation pumps.
- [Zroshua](https://github.com/RobinCK/zroshua) — add-on for smart irrigation: zones, schedules, weather, rain and soil sensors and a live site map.
- [Metron](https://github.com/RobinCK/lovelace-metron) — Lovelace cards for energy, solar, battery, gas and money: live flows, statistics, forecasts and bills.
- [Varta](https://github.com/RobinCK/lovelace-varta) — Lovelace cards that keep watch over the house: offline devices grouped by hub or integration, and batteries with a replacement forecast.
- [Deye Inverter Card](https://github.com/RobinCK/lovelace-deye-inverter-card) — Lovelace card with the state and live values of Deye/Sunsynk hybrid inverters.
- [Phase Pair Card](https://github.com/RobinCK/lovelace-phase-pair-card) — Lovelace card for three-phase homes: voltage and power before and after the voltage stabilizers, phase balance.
- [Osnova](https://github.com/RobinCK/osnova) — theme for the whole Home Assistant interface with a Ukrainian cross-stitch ornament.
- [Solax2HA](https://github.com/RobinCK/solax2ha) — service that sends Solax inverter data to Home Assistant sensors.

## License

[MIT](LICENSE) © Igor Ognichenko
