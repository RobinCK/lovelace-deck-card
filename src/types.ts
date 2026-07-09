/**
 * Minimal Home Assistant frontend types — only what deck-card touches.
 * Kept local to avoid depending on stale typings packages.
 */

export interface HomeAssistant {
  language: string;
  states: Record<string, unknown>;
  localize?: (key: string, ...args: unknown[]) => string;
  [key: string]: unknown;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
}

export interface CardHelpers {
  createCardElement(config: LovelaceCardConfig): LovelaceCard;
}

export type NavMode = 'auto' | 'pills' | 'dots' | 'hidden';

export interface SegmentConfig {
  /** Label shown in the pill / used as the accessible name. */
  name?: string;
  /** Optional mdi icon shown in the pill, e.g. `mdi:sprinkler`. */
  icon?: string;
  /** Optional static badge (counter or short text) shown in the pill. */
  badge?: string | number;
  /** Cards rendered inside this segment (stacked vertically). */
  cards?: LovelaceCardConfig[];
}

export interface DeckCardConfig extends LovelaceCardConfig {
  segments: SegmentConfig[];
  /** Optional header above the deck. */
  title?: string;
  /** Navigation style. Default `auto`: pills on wide viewports, dots on narrow. */
  nav?: NavMode;
  /** Viewport width (px) below which `auto` switches to dots + swipe. Default 640. */
  breakpoint?: number;
  /** Segment shown on load: 0-based index or segment name. */
  default_segment?: number | string;
  /** Persist the last opened segment on this device. Default false. */
  remember?: boolean;
  /** Enable touch swiping between segments. Default true. */
  swipe?: boolean;
  /** Enable transition animations. Default true. */
  animation?: boolean;
  /** Explicit storage key for `remember` (useful for identical decks on different views). */
  key?: string;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
    customCards?: unknown[];
  }
}
