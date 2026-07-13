export const CARD_VERSION = '1.4.1';

/**
 * Sections-style layout: every ~350px of deck width adds one virtual
 * dashboard column of 12 grid units — mirrors how HA sections size cards,
 * so `grid_options.columns` values keep their familiar meaning.
 */
export const GRID_COLUMN_WIDTH = 350;
export const GRID_UNITS_PER_COLUMN = 12;
export const CARD_TAG = 'deck-card';
export const EDITOR_TAG = 'deck-card-editor';

/** Viewport width (px) below which `nav: auto` switches to dots + swipe. */
export const DEFAULT_BREAKPOINT = 640;
