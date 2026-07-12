import { css, html, nothing, LitElement } from 'lit';
import type { TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  mdiArrowDown,
  mdiArrowLeft,
  mdiArrowRight,
  mdiArrowUp,
  mdiClose,
  mdiDelete,
  mdiPencil,
  mdiPlus,
} from '@mdi/js';
import { DEFAULT_BREAKPOINT, EDITOR_TAG } from './const';
import type { DeckCardConfig, HomeAssistant, LovelaceCardConfig, SegmentConfig } from './types';

interface SchemaEntry {
  name?: string;
  type?: string;
  schema?: SchemaEntry[];
  selector?: Record<string, unknown>;
}

const LABELS: Record<string, string> = {
  title: 'Title',
  nav: 'Navigation',
  breakpoint: 'Mobile breakpoint',
  remember: 'Remember last segment',
  swipe: 'Swipe gestures',
  animation: 'Animations',
  default_segment: 'Default segment',
  name: 'Name',
  icon: 'Icon',
  badge: 'Badge',
  columns: 'Width (units)',
  rows: 'Height (rows)',
  full: 'Full width',
};

const HELPERS: Record<string, string> = {
  breakpoint: 'Viewport width (px) below which "Auto" switches to dots + swipe',
  badge: 'Short static text or counter shown in the pill',
  remember: 'Reopen the segment that was active last time on this device',
  columns: '12 units = one dashboard column (48 across a wide desktop)',
  rows: 'One row ≈ 56px, like HA sections. Empty = natural height',
};

const OPTION_DEFAULTS = {
  nav: 'auto',
  breakpoint: DEFAULT_BREAKPOINT,
  remember: false,
  swipe: true,
  animation: true,
} as const;

const SEGMENT_SCHEMA: SchemaEntry[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      { name: 'badge', selector: { text: {} } },
    ],
  },
];

const LAYOUT_SCHEMA: SchemaEntry[] = [
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'columns', selector: { number: { min: 1, max: 48, mode: 'box' } } },
      { name: 'rows', selector: { number: { min: 1, max: 30, mode: 'box' } } },
      { name: 'full', selector: { boolean: {} } },
    ],
  },
];

export class DeckCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** Set by HA's element editor wrapper; forwarded to nested card editors. */
  @property({ attribute: false }) public lovelace?: unknown;

  @state() private _config?: DeckCardConfig;
  @state() private _tab = 0;
  @state() private _editing?: number;
  @state() private _adding = false;
  @state() private _haEditors = false;
  @state() private _haPicker = false;

  public setConfig(config: DeckCardConfig): void {
    this._config = config;
    const count = config.segments?.length ?? 0;
    if (this._tab >= count) {
      this._tab = Math.max(0, count - 1);
    }
  }

  protected firstUpdated(): void {
    void this._loadHaEditorDeps();
  }

  /**
   * hui-card-element-editor / hui-card-picker are lazy chunks of the HA
   * frontend. Requesting the vertical-stack config element pulls both in —
   * the standard trick container-card editors use.
   */
  private async _loadHaEditorDeps(): Promise<void> {
    this._detectHaEditors();
    if (this._haEditors && this._haPicker) {
      return;
    }
    try {
      const helpers = await window.loadCardHelpers?.();
      helpers?.createCardElement({ type: 'vertical-stack', cards: [] });
      await customElements.whenDefined('hui-vertical-stack-card');
      const stack = customElements.get('hui-vertical-stack-card') as
        | { getConfigElement?: () => Promise<unknown> }
        | undefined;
      await stack?.getConfigElement?.();
    } catch {
      // fall back to whatever is already registered
    }
    this._detectHaEditors();
  }

  private _detectHaEditors(): void {
    this._haEditors = !!customElements.get('hui-card-element-editor');
    this._haPicker = !!customElements.get('hui-card-picker');
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) {
      return nothing;
    }
    const segments = this._config.segments ?? [];
    const segment = segments[this._tab] as SegmentConfig | undefined;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._options}
        .schema=${this._optionsSchema(segments)}
        .computeLabel=${computeLabel}
        .computeHelper=${computeHelper}
        @value-changed=${this._optionsChanged}
      ></ha-form>

      <div class="tabs" role="tablist" aria-label="Segments">
        ${segments.map(
          (seg, i) => html`
            <button
              class=${classMap({ tab: true, on: i === this._tab })}
              role="tab"
              aria-selected=${i === this._tab ? 'true' : 'false'}
              @click=${() => this._openTab(i)}
            >
              ${seg.icon ? html`<ha-icon .icon=${seg.icon}></ha-icon>` : nothing}
              <span>${seg.name || `Segment ${i + 1}`}</span>
            </button>
          `
        )}
        <button class="tab add" aria-label="Add segment" @click=${this._addSegment}>
          <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
        </button>
      </div>

      ${segment ? this._renderSegment(segment, this._tab, segments.length) : nothing}
    `;
  }

  private _renderSegment(segment: SegmentConfig, index: number, count: number): TemplateResult {
    const cards = segment.cards ?? [];
    return html`
      <div class="segment">
        <div class="segment-toolbar">
          <span class="segment-title">Segment ${index + 1} of ${count}</span>
          <ha-icon-button
            .path=${mdiArrowLeft}
            label="Move segment left"
            .disabled=${index === 0}
            @click=${() => this._moveSegment(index, -1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${mdiArrowRight}
            label="Move segment right"
            .disabled=${index === count - 1}
            @click=${() => this._moveSegment(index, 1)}
          ></ha-icon-button>
          <ha-icon-button
            class="danger"
            .path=${mdiDelete}
            label="Delete segment"
            .disabled=${count <= 1}
            @click=${() => this._removeSegment(index)}
          ></ha-icon-button>
        </div>

        <ha-form
          .hass=${this.hass}
          .data=${segment}
          .schema=${SEGMENT_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${(ev: CustomEvent) => this._segmentChanged(ev, index)}
        ></ha-form>

        <div class="cards-header">
          <h4>Cards (${cards.length})</h4>
        </div>

        ${cards.map((card, ci) => this._renderCardRow(card, ci, cards.length))}

        ${this._renderAddCard()}
      </div>
    `;
  }

  private _renderCardRow(
    card: LovelaceCardConfig,
    index: number,
    count: number
  ): TemplateResult {
    const editing = this._editing === index;
    return html`
      <div class="card-row">
        <div class="card-head">
          <span class="card-title" title=${card.type}>${index + 1}. ${describeCard(card)}</span>
          <ha-icon-button
            .path=${mdiArrowUp}
            label="Move up"
            .disabled=${index === 0}
            @click=${() => this._moveCard(index, -1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${mdiArrowDown}
            label="Move down"
            .disabled=${index === count - 1}
            @click=${() => this._moveCard(index, 1)}
          ></ha-icon-button>
          <ha-icon-button
            class=${editing ? 'accent' : ''}
            .path=${editing ? mdiClose : mdiPencil}
            label=${editing ? 'Close editor' : 'Edit card'}
            @click=${() => {
              this._editing = editing ? undefined : index;
            }}
          ></ha-icon-button>
          <ha-icon-button
            class="danger"
            .path=${mdiDelete}
            label="Delete card"
            @click=${() => this._removeCard(index)}
          ></ha-icon-button>
        </div>
        <ha-form
          class="layout"
          .hass=${this.hass}
          .data=${layoutData(card)}
          .schema=${LAYOUT_SCHEMA}
          .computeLabel=${computeLabel}
          .computeHelper=${computeHelper}
          @value-changed=${(ev: CustomEvent) => this._cardLayoutChanged(ev, index)}
        ></ha-form>
        ${editing ? this._renderCardEditor(card, index) : nothing}
      </div>
    `;
  }

  private _renderCardEditor(card: LovelaceCardConfig, index: number): TemplateResult {
    if (!this._haEditors) {
      return html`
        <ha-alert alert-type="info">
          The built-in card editor could not be loaded — edit this card in the YAML editor of
          the deck card.
        </ha-alert>
      `;
    }
    return html`
      <div class="card-editor">
        <hui-card-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .value=${card}
          @config-changed=${(ev: CustomEvent) => this._cardConfigChanged(ev, index)}
          @GUI-mode-changed=${(ev: Event) => ev.stopPropagation()}
        ></hui-card-element-editor>
      </div>
    `;
  }

  private _renderAddCard(): TemplateResult {
    if (this._adding && this._haPicker) {
      return html`
        <div class="picker">
          <div class="picker-head">
            <span>Pick a card</span>
            <ha-icon-button
              .path=${mdiClose}
              label="Cancel"
              @click=${() => {
                this._adding = false;
              }}
            ></ha-icon-button>
          </div>
          <hui-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            @config-changed=${this._cardPicked}
          ></hui-card-picker>
        </div>
      `;
    }
    return html`
      <ha-button class="add-card" @click=${this._onAddCard}>
        <ha-svg-icon slot="start" .path=${mdiPlus}></ha-svg-icon>
        Add card
      </ha-button>
    `;
  }

  private _onAddCard = (): void => {
    if (this._haPicker) {
      this._adding = true;
    } else {
      // Picker chunk unavailable — add an editable stub instead.
      this._appendCard({ type: 'markdown', content: 'New card' });
    }
  };

  // ------------------------------------------------------------- top options

  private get _options(): Record<string, unknown> {
    const config = this._config!;
    return {
      title: config.title ?? '',
      nav: config.nav ?? OPTION_DEFAULTS.nav,
      breakpoint: config.breakpoint ?? OPTION_DEFAULTS.breakpoint,
      remember: config.remember ?? OPTION_DEFAULTS.remember,
      swipe: config.swipe ?? OPTION_DEFAULTS.swipe,
      animation: config.animation ?? OPTION_DEFAULTS.animation,
      default_segment: config.default_segment ?? '',
    };
  }

  private _optionsSchema(segments: SegmentConfig[]): SchemaEntry[] {
    const named = segments.filter((segment) => segment.name);
    return [
      { name: 'title', selector: { text: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'nav',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'auto', label: 'Auto (pills → dots)' },
                  { value: 'pills', label: 'Pills' },
                  { value: 'dots', label: 'Dots' },
                  { value: 'hidden', label: 'Hidden (swipe only)' },
                ],
              },
            },
          },
          {
            name: 'breakpoint',
            selector: {
              number: { min: 200, max: 1600, step: 10, mode: 'box', unit_of_measurement: 'px' },
            },
          },
          ...(named.length
            ? [
                {
                  name: 'default_segment',
                  selector: {
                    select: {
                      mode: 'dropdown',
                      options: named.map((segment) => ({
                        value: segment.name as string,
                        label: segment.name as string,
                      })),
                    },
                  },
                },
              ]
            : []),
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'remember', selector: { boolean: {} } },
          { name: 'swipe', selector: { boolean: {} } },
          { name: 'animation', selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _optionsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) {
      return;
    }
    const value = ev.detail.value as Record<string, unknown>;
    const next: DeckCardConfig = { ...this._config, ...value };
    if (!next.title) {
      delete next.title;
    }
    if (next.default_segment === '' || next.default_segment == null) {
      delete next.default_segment;
    }
    for (const [key, fallback] of Object.entries(OPTION_DEFAULTS)) {
      if ((next as Record<string, unknown>)[key] === fallback) {
        delete (next as Record<string, unknown>)[key];
      }
    }
    this._emit(next);
  }

  // --------------------------------------------------------------- segments

  private _openTab(index: number): void {
    this._tab = index;
    this._editing = undefined;
    this._adding = false;
  }

  private _segmentChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    if (!this._config) {
      return;
    }
    const value = ev.detail.value as SegmentConfig;
    const segments = [...this._config.segments];
    const updated: SegmentConfig = {
      ...segments[index],
      ...value,
      cards: segments[index].cards ?? [],
    };
    if (!updated.name) {
      delete updated.name;
    }
    if (!updated.icon) {
      delete updated.icon;
    }
    if (updated.badge === '' || updated.badge == null) {
      delete updated.badge;
    }
    segments[index] = updated;
    this._emit({ ...this._config, segments });
  }

  private _addSegment(): void {
    if (!this._config) {
      return;
    }
    const segments = [
      ...this._config.segments,
      { name: `Page ${this._config.segments.length + 1}`, cards: [] },
    ];
    this._emit({ ...this._config, segments });
    this._openTab(segments.length - 1);
  }

  private _removeSegment(index: number): void {
    if (!this._config || this._config.segments.length <= 1) {
      return;
    }
    const segments = this._config.segments.filter((_, i) => i !== index);
    this._emit({ ...this._config, segments });
    this._openTab(Math.min(index, segments.length - 1));
  }

  private _moveSegment(index: number, delta: number): void {
    if (!this._config) {
      return;
    }
    const target = index + delta;
    if (target < 0 || target >= this._config.segments.length) {
      return;
    }
    const segments = [...this._config.segments];
    [segments[index], segments[target]] = [segments[target], segments[index]];
    this._emit({ ...this._config, segments });
    this._openTab(target);
  }

  // ------------------------------------------------------------------ cards

  private _updateCards(cards: LovelaceCardConfig[]): void {
    if (!this._config) {
      return;
    }
    const segments = [...this._config.segments];
    segments[this._tab] = { ...segments[this._tab], cards };
    this._emit({ ...this._config, segments });
  }

  private _cardLayoutChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    const segment = this._config?.segments[this._tab];
    if (!segment) {
      return;
    }
    const value = ev.detail.value as { columns?: number; rows?: number; full?: boolean };
    const gridOptions: Record<string, unknown> = {};
    if (value.full) {
      gridOptions.columns = 'full';
    } else if (typeof value.columns === 'number') {
      gridOptions.columns = value.columns;
    }
    if (typeof value.rows === 'number') {
      gridOptions.rows = value.rows;
    }
    const cards = [...(segment.cards ?? [])];
    const card = { ...cards[index] };
    if (Object.keys(gridOptions).length) {
      card.grid_options = gridOptions;
    } else {
      delete card.grid_options;
    }
    cards[index] = card;
    this._updateCards(cards);
  }

  private _cardConfigChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    const segment = this._config?.segments[this._tab];
    if (!segment) {
      return;
    }
    const cards = [...(segment.cards ?? [])];
    const previous = cards[index] as LovelaceCardConfig;
    const next = { ...(ev.detail.config as LovelaceCardConfig) };
    // The nested editor doesn't know about layout — keep it unless YAML set it.
    if (previous.grid_options && next.grid_options === undefined) {
      next.grid_options = previous.grid_options;
    }
    cards[index] = next;
    this._updateCards(cards);
  }

  private _cardPicked = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const config = ev.detail.config as LovelaceCardConfig | undefined;
    if (!config) {
      return;
    }
    this._adding = false;
    this._appendCard(config);
  };

  private _appendCard(config: LovelaceCardConfig): void {
    const segment = this._config?.segments[this._tab];
    if (!segment) {
      return;
    }
    const cards = [...(segment.cards ?? []), config];
    this._updateCards(cards);
    this._editing = cards.length - 1;
  }

  private _removeCard(index: number): void {
    const segment = this._config?.segments[this._tab];
    if (!segment) {
      return;
    }
    this._editing = undefined;
    this._updateCards((segment.cards ?? []).filter((_, i) => i !== index));
  }

  private _moveCard(index: number, delta: number): void {
    const segment = this._config?.segments[this._tab];
    if (!segment) {
      return;
    }
    const cards = [...(segment.cards ?? [])];
    const target = index + delta;
    if (target < 0 || target >= cards.length) {
      return;
    }
    [cards[index], cards[target]] = [cards[target], cards[index]];
    if (this._editing === index) {
      this._editing = target;
    } else if (this._editing === target) {
      this._editing = index;
    }
    this._updateCards(cards);
  }

  private _emit(config: DeckCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    ha-form {
      display: block;
    }

    /* ---------------------------------------------------------- tabs */

    .tabs {
      display: flex;
      gap: 4px;
      margin-top: 16px;
      padding: 4px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
      border-radius: 12px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: none;
      border-radius: 8px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
    }

    .tab:hover {
      color: var(--primary-text-color);
    }

    .tab.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .tab ha-icon {
      --mdc-icon-size: 16px;
      display: flex;
    }

    .tab.add {
      margin-left: auto;
      padding: 8px 10px;
    }

    .tab.add ha-svg-icon {
      width: 18px;
      height: 18px;
    }

    /* ------------------------------------------------------- segment */

    .segment {
      margin-top: 8px;
      padding: 8px 12px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
    }

    .segment-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }

    .segment-title {
      flex: 1;
      font-size: 13px;
    }

    .cards-header h4 {
      margin: 16px 0 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    /* --------------------------------------------------------- cards */

    .card-row {
      margin-top: 8px;
      padding: 4px 10px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--card-background-color, transparent);
    }

    .card-head {
      display: flex;
      align-items: center;
      --mdc-icon-button-size: 34px;
      --mdc-icon-size: 17px;
      color: var(--secondary-text-color);
    }

    .card-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-weight: 500;
      font-size: 14px;
    }

    .layout {
      margin-top: 2px;
    }

    .card-editor {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--divider-color);
    }

    .add-card {
      margin-top: 12px;
    }

    .picker {
      margin-top: 12px;
      padding: 8px 12px 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
    }

    .picker-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--secondary-text-color);
      font-size: 13px;
    }

    .danger {
      color: var(--error-color);
    }

    .accent {
      color: var(--primary-color);
    }

    ha-alert {
      display: block;
      margin-top: 8px;
    }
  `;
}

function describeCard(config: LovelaceCardConfig): string {
  const type = String(config.type ?? '?').replace(/^custom:/, '');
  const extra =
    (config.name as string) ||
    (config.title as string) ||
    (config.entity as string) ||
    (config.view as string) ||
    '';
  return extra ? `${type} · ${extra}` : type;
}

function layoutData(config: LovelaceCardConfig): Record<string, unknown> {
  const gridOptions = (config.grid_options ?? {}) as { columns?: number | string; rows?: number | string };
  return {
    columns: typeof gridOptions.columns === 'number' ? gridOptions.columns : undefined,
    rows: typeof gridOptions.rows === 'number' ? gridOptions.rows : undefined,
    full: gridOptions.columns === 'full',
  };
}

function computeLabel(schema: SchemaEntry): string {
  return LABELS[schema.name ?? ''] ?? schema.name ?? '';
}

function computeHelper(schema: SchemaEntry): string | undefined {
  return HELPERS[schema.name ?? ''];
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, DeckCardEditor);
}
