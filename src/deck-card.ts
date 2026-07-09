import { css, html, nothing, LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { CARD_TAG, CARD_VERSION, DEFAULT_BREAKPOINT, EDITOR_TAG } from './const';
import type {
  CardHelpers,
  DeckCardConfig,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  SegmentConfig,
} from './types';
import './deck-card-editor';

/** Elements with their own horizontal gestures — never hijack a swipe that starts on them. */
const SWIPE_IGNORE =
  /slider|range|input|textarea|select|knob|dial|map|scrubber|swipe|carousel|gallery/;

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface DragState {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  t0: number;
  width: number;
  active: boolean;
}

export class DeckCard extends LitElement {
  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      segments: [
        { name: 'Page 1', icon: 'mdi:view-dashboard', cards: [] },
        { name: 'Page 2', icon: 'mdi:tune', cards: [] },
      ],
    };
  }

  @state() private _config?: DeckCardConfig;
  @state() private _active = 0;
  @state() private _narrow = false;
  @state() private _cards: LovelaceCard[][] = [];

  @query('.viewport') private _viewport?: HTMLElement;
  @query('.track') private _track?: HTMLElement;

  private _hass?: HomeAssistant;
  private _drag?: DragState;
  private _suppressClick = false;
  private _heightInit = false;
  private _indicatorInit = false;
  private _buildId = 0;
  private _mql?: MediaQueryList;

  private _hostRO = new ResizeObserver(() => {
    this._syncHeight();
    this._syncIndicator();
  });

  private _panelRO = new ResizeObserver(() => this._syncHeight());

  private _mqlListener = (e: MediaQueryListEvent): void => {
    this._narrow = e.matches;
  };

  @property({ attribute: false })
  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    for (const segment of this._cards) {
      for (const card of segment) {
        card.hass = hass;
      }
    }
  }

  public get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  public setConfig(config: DeckCardConfig): void {
    if (!config || !Array.isArray(config.segments) || config.segments.length === 0) {
      throw new Error('deck-card: "segments" must be a non-empty list');
    }
    config.segments.forEach((segment, i) => {
      if (!segment || typeof segment !== 'object') {
        throw new Error(`deck-card: segment ${i + 1} is invalid`);
      }
      if (segment.cards !== undefined && !Array.isArray(segment.cards)) {
        throw new Error(`deck-card: segment ${i + 1}: "cards" must be a list`);
      }
    });

    const firstConfig = !this._config;
    this._config = config;
    // Keep the open segment stable while the config is being edited live.
    this._active = firstConfig
      ? this._initialIndex(config)
      : Math.min(this._active, config.segments.length - 1);
    this._heightInit = false;
    this._indicatorInit = false;
    this.style.setProperty('--deck-card-duration', config.animation === false ? '0ms' : '');
    this._setupMedia();
    void this._buildCards(config);
  }

  public async getCardSize(): Promise<number> {
    const cards = this._cards[this._active] ?? [];
    if (!cards.length) {
      return 3;
    }
    const sizes = await Promise.all(
      cards.map(async (card) => {
        try {
          return (await card.getCardSize?.()) ?? 4;
        } catch {
          return 4;
        }
      })
    );
    return sizes.reduce((sum, size) => sum + size, 0);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._hostRO.observe(this);
    this._setupMedia();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hostRO.disconnect();
    this._panelRO.disconnect();
    this._mql?.removeEventListener('change', this._mqlListener);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) {
      return nothing;
    }
    const config = this._config;
    const segments = config.segments;
    const nav = config.nav ?? 'auto';
    const multi = segments.length > 1;
    const showPills = multi && (nav === 'pills' || (nav === 'auto' && !this._narrow));
    const showDots = multi && (nav === 'dots' || (nav === 'auto' && this._narrow));
    const factor = this._rtl ? 1 : -1;

    return html`
      ${config.title ? html`<h1 class="title">${config.title}</h1>` : nothing}
      ${showPills ? this._renderPills(segments) : nothing}
      <div
        class=${classMap({ viewport: true, 'no-swipe': !this._swipeEnabled })}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div
          class="track"
          style=${styleMap({ transform: `translateX(${factor * this._active * 100}%)` })}
        >
          ${segments.map(
            (segment, i) => html`
              <section
                class="panel"
                role="tabpanel"
                aria-label=${segment.name ?? `Segment ${i + 1}`}
                ?inert=${i !== this._active}
              >
                ${this._cards[i]?.length ? this._cards[i] : this._renderEmpty()}
              </section>
            `
          )}
        </div>
      </div>
      ${showDots ? this._renderDots(segments) : nothing}
    `;
  }

  private _renderPills(segments: SegmentConfig[]): TemplateResult {
    return html`
      <nav
        class="pills"
        role="tablist"
        aria-label=${this._config?.title ?? 'Deck'}
        @keydown=${this._onNavKeydown}
      >
        <div class="pill-indicator" aria-hidden="true"></div>
        ${segments.map(
          (segment, i) => html`
            <button
              class=${classMap({ pill: true, active: i === this._active })}
              role="tab"
              aria-selected=${i === this._active ? 'true' : 'false'}
              tabindex=${i === this._active ? 0 : -1}
              @click=${() => this._select(i)}
            >
              ${segment.icon ? html`<ha-icon .icon=${segment.icon}></ha-icon>` : nothing}
              ${segment.name ? html`<span class="label">${segment.name}</span>` : nothing}
              ${segment.badge !== undefined && segment.badge !== ''
                ? html`<span class="pill-badge">${segment.badge}</span>`
                : nothing}
            </button>
          `
        )}
      </nav>
    `;
  }

  private _renderDots(segments: SegmentConfig[]): TemplateResult {
    return html`
      <nav class="dots" role="tablist" aria-label=${this._config?.title ?? 'Deck'} @keydown=${this._onNavKeydown}>
        ${segments.map(
          (segment, i) => html`
            <button
              class=${classMap({ dot: true, active: i === this._active })}
              role="tab"
              aria-selected=${i === this._active ? 'true' : 'false'}
              tabindex=${i === this._active ? 0 : -1}
              aria-label=${segment.name ?? `Segment ${i + 1}`}
              title=${segment.name ?? `Segment ${i + 1}`}
              @click=${() => this._select(i)}
            >
              <span></span>
            </button>
          `
        )}
      </nav>
    `;
  }

  private _renderEmpty(): TemplateResult {
    return html`<div class="empty">Empty segment — add cards to it in the editor</div>`;
  }

  protected firstUpdated(): void {
    // Pointer capture retargets the post-drag click to the viewport, but keep a
    // capture-phase guard so an aborted drag never toggles an entity by accident.
    this._viewport?.addEventListener(
      'click',
      (e: MouseEvent) => {
        if (this._suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          this._suppressClick = false;
        }
      },
      { capture: true }
    );
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    this._observeActivePanel();
    this._syncHeight();
    this._syncIndicator();
    if (changed.has('_active')) {
      this._scrollActivePillIntoView();
    }
  }

  // ------------------------------------------------------------------ cards

  private async _buildCards(config: DeckCardConfig): Promise<void> {
    const buildId = ++this._buildId;
    const helpers = await window.loadCardHelpers?.();
    if (buildId !== this._buildId) {
      return;
    }
    if (!helpers) {
      console.error('deck-card: window.loadCardHelpers is unavailable');
      return;
    }
    this._cards = config.segments.map((segment, si) =>
      (segment.cards ?? []).map((cardConfig, ci) => this._createCard(helpers, cardConfig, si, ci))
    );
  }

  private _createCard(
    helpers: CardHelpers,
    cardConfig: LovelaceCardConfig,
    segmentIndex: number,
    cardIndex: number
  ): LovelaceCard {
    const element = helpers.createCardElement(cardConfig);
    if (this._hass) {
      element.hass = this._hass;
    }
    element.addEventListener('ll-rebuild', (ev: Event) => {
      ev.stopPropagation();
      const fresh = this._createCard(helpers, cardConfig, segmentIndex, cardIndex);
      const segment = [...(this._cards[segmentIndex] ?? [])];
      segment[cardIndex] = fresh;
      const all = [...this._cards];
      all[segmentIndex] = segment;
      this._cards = all;
    });
    return element;
  }

  // -------------------------------------------------------------- selection

  private _select(index: number): void {
    const count = this._config?.segments.length ?? 0;
    const target = Math.max(0, Math.min(count - 1, index));
    if (target === this._active) {
      return;
    }
    this._active = target;
    if (this._config?.remember) {
      try {
        localStorage.setItem(this._storageKey, String(target));
      } catch {
        // storage unavailable — ignore
      }
    }
    // Light haptic tick in the HA companion app.
    window.dispatchEvent(new CustomEvent('haptic', { detail: 'light' }));
  }

  private _initialIndex(config: DeckCardConfig): number {
    const count = config.segments.length;
    if (config.remember) {
      try {
        const saved = localStorage.getItem(this._storageKeyFor(config));
        if (saved !== null) {
          const index = Number.parseInt(saved, 10);
          if (Number.isInteger(index) && index >= 0 && index < count) {
            return index;
          }
        }
      } catch {
        // storage unavailable — fall through
      }
    }
    const preferred = config.default_segment;
    if (typeof preferred === 'number' && Number.isInteger(preferred)) {
      return Math.max(0, Math.min(count - 1, preferred));
    }
    if (typeof preferred === 'string') {
      const index = config.segments.findIndex((segment) => segment.name === preferred);
      if (index >= 0) {
        return index;
      }
    }
    return 0;
  }

  private get _storageKey(): string {
    return this._storageKeyFor(this._config!);
  }

  private _storageKeyFor(config: DeckCardConfig): string {
    const base =
      config.key ??
      String(
        hash(config.segments.map((segment) => `${segment.name ?? ''}|${segment.icon ?? ''}`).join(','))
      );
    return `deck-card:${base}`;
  }

  // ------------------------------------------------------------------ swipe

  private get _swipeEnabled(): boolean {
    return this._config?.swipe !== false && (this._config?.segments.length ?? 0) > 1;
  }

  private get _rtl(): boolean {
    return getComputedStyle(this).direction === 'rtl';
  }

  private _onPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' || !this._swipeEnabled || this._drag) {
      return;
    }
    for (const node of e.composedPath()) {
      if (node === e.currentTarget) {
        break;
      }
      if (node instanceof Element && SWIPE_IGNORE.test(node.localName)) {
        return;
      }
    }
    this._drag = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      t0: performance.now(),
      width: (e.currentTarget as HTMLElement).offsetWidth || 1,
      active: false,
    };
  }

  private _onPointerMove(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.id) {
      return;
    }
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.active) {
      if (Math.abs(dx) < 8) {
        return;
      }
      if (Math.abs(dx) <= Math.abs(dy)) {
        // Vertical intent — let the page scroll.
        this._drag = undefined;
        return;
      }
      drag.active = true;
      (e.currentTarget as HTMLElement).setPointerCapture(drag.id);
      if (this._track) {
        this._track.style.transition = 'none';
      }
    }
    const count = this._config?.segments.length ?? 1;
    const step = (dx < 0 ? 1 : -1) * (this._rtl ? -1 : 1);
    const target = this._active + step;
    // Rubber-band resistance at the edges.
    drag.dx = target < 0 || target > count - 1 ? dx * 0.25 : dx;
    this._applyTransform(drag.dx);
  }

  private _onPointerUp(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.id) {
      return;
    }
    this._drag = undefined;
    if (!drag.active || !this._track) {
      return;
    }
    this._suppressClick = true;
    window.setTimeout(() => {
      this._suppressClick = false;
    }, 150);
    this._track.style.transition = '';
    const count = this._config?.segments.length ?? 1;
    const elapsed = Math.max(1, performance.now() - drag.t0);
    const velocity = drag.dx / elapsed;
    const step = (drag.dx < 0 ? 1 : -1) * (this._rtl ? -1 : 1);
    // Advance on a long drag, or on a quick flick that still travelled a real distance.
    const shouldMove =
      Math.abs(drag.dx) > drag.width * 0.2 ||
      (Math.abs(velocity) > 0.35 && Math.abs(drag.dx) > 24);
    const target = this._active + (shouldMove ? step : 0);
    if (shouldMove && target >= 0 && target < count) {
      this._select(target);
    } else {
      this._applyTransform(0);
    }
  }

  private _onPointerCancel(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.id) {
      return;
    }
    this._drag = undefined;
    if (drag.active && this._track) {
      this._track.style.transition = '';
      this._applyTransform(0);
    }
  }

  private _applyTransform(offsetPx: number): void {
    if (!this._track) {
      return;
    }
    const factor = this._rtl ? 1 : -1;
    this._track.style.transform = `translateX(calc(${factor * this._active * 100}% + ${offsetPx}px))`;
  }

  // --------------------------------------------------------------- keyboard

  private _onNavKeydown(e: KeyboardEvent): void {
    const count = this._config?.segments.length ?? 0;
    if (count < 2) {
      return;
    }
    const dir = this._rtl ? -1 : 1;
    let target: number;
    switch (e.key) {
      case 'ArrowRight':
        target = this._active + dir;
        break;
      case 'ArrowLeft':
        target = this._active - dir;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = count - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    this._select((target + count) % count);
    void this.updateComplete.then(() => {
      const tabs = this.renderRoot.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs[this._active]?.focus();
    });
  }

  // ------------------------------------------------------------ measurement

  private _panel(index: number): HTMLElement | undefined {
    return this.renderRoot.querySelectorAll<HTMLElement>('.panel')[index];
  }

  private _observeActivePanel(): void {
    this._panelRO.disconnect();
    const panel = this._panel(this._active);
    if (panel) {
      this._panelRO.observe(panel);
    }
  }

  private _syncHeight(): void {
    const viewport = this._viewport;
    const panel = this._panel(this._active);
    // Until child cards exist all panels share the placeholder height — leave it auto.
    if (!viewport || !panel || !this._cards.length) {
      return;
    }
    const height = panel.offsetHeight;
    if (!height) {
      return;
    }
    if (!this._heightInit) {
      viewport.style.transition = 'none';
      viewport.style.height = `${height}px`;
      void viewport.offsetHeight; // flush so the transition doesn't animate the first set
      viewport.style.transition = '';
      this._heightInit = true;
      return;
    }
    viewport.style.height = `${height}px`;
  }

  private _syncIndicator(): void {
    const nav = this.renderRoot.querySelector<HTMLElement>('.pills');
    const indicator = nav?.querySelector<HTMLElement>('.pill-indicator');
    if (!nav || !indicator) {
      this._indicatorInit = false;
      return;
    }
    const pill = nav.querySelectorAll<HTMLElement>('.pill')[this._active];
    if (!pill) {
      return;
    }
    if (!this._indicatorInit) {
      indicator.style.transition = 'none';
    }
    indicator.style.transform = `translate(${pill.offsetLeft}px, ${pill.offsetTop}px)`;
    indicator.style.width = `${pill.offsetWidth}px`;
    indicator.style.height = `${pill.offsetHeight}px`;
    if (!this._indicatorInit) {
      void indicator.offsetWidth;
      indicator.style.transition = '';
      this._indicatorInit = true;
    }
  }

  private _scrollActivePillIntoView(): void {
    const nav = this.renderRoot.querySelector<HTMLElement>('.pills');
    if (!nav || nav.scrollWidth <= nav.clientWidth + 1) {
      return;
    }
    const pill = nav.querySelectorAll<HTMLElement>('.pill')[this._active];
    pill?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: REDUCED_MOTION ? 'auto' : 'smooth',
    });
  }

  private _setupMedia(): void {
    this._mql?.removeEventListener('change', this._mqlListener);
    const breakpoint = this._config?.breakpoint ?? DEFAULT_BREAKPOINT;
    this._mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    this._narrow = this._mql.matches;
    if (this.isConnected) {
      this._mql.addEventListener('change', this._mqlListener);
    }
  }

  // ------------------------------------------------------------------ style

  static styles = css`
    :host {
      display: block;
      --deck-ease: var(--deck-card-easing, cubic-bezier(0.19, 1, 0.22, 1));
      --deck-duration: var(--deck-card-duration, 250ms);
    }

    .title {
      margin: 0 4px 12px;
      color: var(--primary-text-color);
      font-size: var(--ha-card-header-font-size, 24px);
      font-weight: 400;
      line-height: 1.2;
    }

    /* ------------------------------------------------------------- pills */

    .pills {
      position: relative;
      display: flex;
      gap: 4px;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      margin: 0 auto 12px;
      padding: 4px;
      background: var(--deck-card-nav-background, var(--secondary-background-color, rgba(127, 127, 127, 0.14)));
      border-radius: var(--deck-card-nav-border-radius, 999px);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .pills::-webkit-scrollbar {
      display: none;
    }

    .pill-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-radius: 999px;
      background: var(--deck-card-pill-active-background, var(--primary-color));
      transition:
        transform var(--deck-duration) var(--deck-ease),
        width var(--deck-duration) var(--deck-ease),
        height var(--deck-duration) var(--deck-ease);
      will-change: transform;
    }

    .pill {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 999px;
      background: none;
      color: var(--deck-card-pill-color, var(--secondary-text-color));
      font: inherit;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      transition: color var(--deck-duration) var(--deck-ease);
      -webkit-tap-highlight-color: transparent;
    }

    .pill:hover {
      color: var(--primary-text-color);
    }

    .pill:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .pill.active {
      color: var(--deck-card-pill-active-color, var(--text-primary-color, #fff));
    }

    .pill ha-icon {
      --mdc-icon-size: 18px;
      display: flex;
    }

    .pill-badge {
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--deck-card-badge-background, rgba(127, 127, 127, 0.22));
      font-size: 11px;
      font-weight: 600;
    }

    .pill.active .pill-badge {
      background: rgba(0, 0, 0, 0.18);
    }

    /* ---------------------------------------------------------- viewport */

    .viewport {
      overflow: hidden;
      touch-action: pan-y;
      transition: height var(--deck-duration) var(--deck-ease);
    }

    .viewport.no-swipe {
      touch-action: auto;
    }

    .track {
      display: flex;
      align-items: flex-start;
      transition: transform var(--deck-duration) var(--deck-ease);
      will-change: transform;
    }

    .panel {
      flex: 0 0 100%;
      width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--deck-card-gap, 8px);
    }

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      border: 2px dashed var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: var(--ha-card-border-radius, 12px);
      color: var(--secondary-text-color);
      font-size: 14px;
      text-align: center;
      padding: 0 16px;
    }

    /* -------------------------------------------------------------- dots */

    .dots {
      display: flex;
      justify-content: center;
      gap: 2px;
      padding: 10px 0 2px;
    }

    .dot {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .dot span {
      width: 7px;
      height: 7px;
      border-radius: 4px;
      background: var(--deck-card-dot-color, var(--secondary-text-color));
      opacity: 0.35;
      transition:
        width var(--deck-duration) var(--deck-ease),
        opacity var(--deck-duration) var(--deck-ease),
        background var(--deck-duration) var(--deck-ease);
    }

    .dot.active span {
      width: 20px;
      opacity: 1;
      background: var(--deck-card-dot-active-color, var(--primary-color));
    }

    .dot:focus-visible span {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        --deck-duration: 0ms;
      }
    }
  `;
}

/** djb2 string hash — stable storage keys without config noise. */
function hash(input: string): number {
  let value = 5381;
  for (let i = 0; i < input.length; i++) {
    value = ((value << 5) + value + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, DeckCard);
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TAG,
  name: 'Deck Card',
  description:
    'Adaptive segmented container: pill tabs on desktop, swipe + dots on mobile.',
  preview: false,
  documentationURL: 'https://github.com/RobinCK/lovelace-deck-card',
});

console.info(
  `%c DECK-CARD %c v${CARD_VERSION} `,
  'background:#4f6cff;color:#fff;padding:2px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'background:#37474f;color:#fff;padding:2px 8px;border-radius:0 4px 4px 0'
);
