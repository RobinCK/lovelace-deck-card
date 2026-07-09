import { css, html, nothing, LitElement } from 'lit';
import type { TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { mdiArrowDown, mdiArrowUp, mdiDelete, mdiPlus } from '@mdi/js';
import { DEFAULT_BREAKPOINT, EDITOR_TAG } from './const';
import type { DeckCardConfig, HomeAssistant, SegmentConfig } from './types';

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
};

const HELPERS: Record<string, string> = {
  breakpoint: 'Viewport width (px) below which "Auto" switches to dots + swipe',
  badge: 'Short static text or counter shown in the pill',
  remember: 'Reopen the segment that was active last time on this device',
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

export class DeckCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: DeckCardConfig;

  public setConfig(config: DeckCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) {
      return nothing;
    }
    const segments = this._config.segments ?? [];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._options}
        .schema=${this._optionsSchema(segments)}
        .computeLabel=${computeLabel}
        .computeHelper=${computeHelper}
        @value-changed=${this._optionsChanged}
      ></ha-form>

      <div class="segments-header">
        <h3>Segments</h3>
        <ha-icon-button .path=${mdiPlus} label="Add segment" @click=${this._addSegment}></ha-icon-button>
      </div>

      ${segments.map((segment, i) => this._renderSegment(segment, i, segments.length))}

      <ha-alert alert-type="info">
        Cards inside each segment are edited in YAML for now — open the code editor and fill
        <code>segments → cards</code>.
      </ha-alert>
    `;
  }

  private _renderSegment(segment: SegmentConfig, index: number, count: number): TemplateResult {
    return html`
      <div class="segment">
        <div class="segment-toolbar">
          <span class="segment-title">
            ${segment.name || `Segment ${index + 1}`}
            <span class="segment-meta">· ${(segment.cards ?? []).length} card(s)</span>
          </span>
          <ha-icon-button
            .path=${mdiArrowUp}
            label="Move up"
            .disabled=${index === 0}
            @click=${() => this._moveSegment(index, -1)}
          ></ha-icon-button>
          <ha-icon-button
            .path=${mdiArrowDown}
            label="Move down"
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
      </div>
    `;
  }

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

  private _segmentChanged(ev: CustomEvent, index: number): void {
    ev.stopPropagation();
    if (!this._config) {
      return;
    }
    const value = ev.detail.value as SegmentConfig;
    const segments = [...this._config.segments];
    const updated: SegmentConfig = { ...segments[index], ...value, cards: segments[index].cards ?? [] };
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
  }

  private _removeSegment(index: number): void {
    if (!this._config || this._config.segments.length <= 1) {
      return;
    }
    const segments = this._config.segments.filter((_, i) => i !== index);
    this._emit({ ...this._config, segments });
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

    .segments-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
    }

    .segments-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .segment {
      margin-top: 8px;
      padding: 4px 12px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }

    .segment-toolbar {
      display: flex;
      align-items: center;
      gap: 0;
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 18px;
    }

    .segment-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .segment-meta {
      color: var(--secondary-text-color);
      font-weight: 400;
    }

    .danger {
      color: var(--error-color);
    }

    ha-alert {
      display: block;
      margin-top: 16px;
    }

    code {
      font-size: 12px;
    }
  `;
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
