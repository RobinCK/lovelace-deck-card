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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface DragState {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  t0: number;
  width: number;
  height: number;
  active: boolean;
  ready: boolean;
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
  /** Set while a select animation is running — the track uses slider layout. */
  @state() private _transition?: { from: number };
  /** Set while a touch drag (and its settle animation) is running. */
  @state() private _dragging = false;

  @query('.viewport') private _viewport?: HTMLElement;
  @query('.track') private _track?: HTMLElement;

  private _hass?: HomeAssistant;
  private _drag?: DragState;
  private _suppressClick = false;
  private _indicatorInit = false;
  private _buildId = 0;
  private _animToken = 0;
  private _mql?: MediaQueryList;

  private _hostRO = new ResizeObserver(() => this._syncIndicator());

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
    this._mql?.removeEventListener('change', this._mqlListener);
  }

  /**
   * While idle the active panel sits in normal document flow with NO transform
   * on any ancestor, so position:fixed dialogs opened by child cards work.
   * Slider layout (all panels in a row + translateX) exists only during a
   * drag or a select animation.
   */
  private get _animMode(): boolean {
    return !!this._transition || this._dragging;
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
    const animMode = this._animMode;

    return html`
      ${config.title ? html`<h1 class="title">${config.title}</h1>` : nothing}
      ${showPills ? this._renderPills(segments) : nothing}
      <div
        class=${classMap({ viewport: true, anim: animMode, 'no-swipe': !this._swipeEnabled })}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
      >
        <div class=${classMap({ track: true, anim: animMode })}>
          ${segments.map((segment, i) => {
            const minWidth = normalizeWidth(segment.min_card_width ?? config.min_card_width);
            return html`
              <section
                class=${classMap({ panel: true, active: i === this._active, columns: !!minWidth })}
                style=${styleMap(
                  minWidth
                    ? {
                        'grid-template-columns': `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))`,
                      }
                    : {}
                )}
                role="tabpanel"
                aria-label=${segment.name ?? `Segment ${i + 1}`}
                ?inert=${i !== this._active}
              >
                ${this._cards[i]?.length ? this._cards[i] : this._renderEmpty()}
              </section>
            `;
          })}
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
    if (!this._animMode) {
      // Idle: the panel is in normal flow — no leftover inline slider styles.
      if (this._track) {
        this._track.style.transform = '';
        this._track.style.transition = '';
      }
      if (this._viewport) {
        this._viewport.style.height = '';
        this._viewport.style.transition = '';
      }
    }
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
    // `deck_span` is a layout hint for this container — strip it so the child
    // card never sees an unknown option.
    const { deck_span: span, ...childConfig } = cardConfig as LovelaceCardConfig & {
      deck_span?: unknown;
    };
    const element = helpers.createCardElement(childConfig as LovelaceCardConfig);
    if (span === 'full') {
      element.style.gridColumn = '1 / -1';
    } else if (typeof span === 'number' && Number.isInteger(span) && span > 1) {
      element.style.gridColumn = `span ${span}`;
    }
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
    const from = this._active;
    this._commitSelect(target);
    if (this._dragging || this._duration() <= 0) {
      return; // a drag settles itself; zero duration switches statically
    }
    void this._animateTo(from, target);
  }

  private _commitSelect(target: number): void {
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

  /** Slide from one panel to another, then return to the static layout. */
  private async _animateTo(from: number, to: number): Promise<void> {
    const token = ++this._animToken;
    const heightBefore = this._viewport?.offsetHeight ?? 0;
    this._transition = { from };
    await this.updateComplete;
    const track = this._track;
    const viewport = this._viewport;
    if (!track || !viewport) {
      if (token === this._animToken) {
        this._transition = undefined;
      }
      return;
    }
    const factor = this._rtl ? 1 : -1;
    track.style.transition = 'none';
    viewport.style.transition = 'none';
    track.style.transform = `translateX(${factor * from * 100}%)`;
    viewport.style.height = `${heightBefore}px`;
    void track.offsetWidth; // flush so the jump to the start position doesn't animate
    track.style.transition = '';
    viewport.style.transition = '';
    track.style.transform = `translateX(${factor * to * 100}%)`;
    const panel = this.renderRoot.querySelectorAll<HTMLElement>('.panel')[to];
    if (panel) {
      viewport.style.height = `${panel.offsetHeight}px`;
    }
    await wait(this._duration() + 60);
    if (token === this._animToken) {
      this._transition = undefined;
    }
  }

  private _duration(): number {
    if (REDUCED_MOTION) {
      return 0;
    }
    const raw = getComputedStyle(this).getPropertyValue('--deck-duration').trim();
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) {
      return 250;
    }
    return raw.endsWith('ms') || !raw.endsWith('s') ? value : value * 1000;
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
    if (e.pointerType === 'mouse' || !this._swipeEnabled) {
      return;
    }
    if (this._drag || this._dragging || this._transition) {
      return; // an animation or another drag is still in flight
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
      height: 0,
      active: false,
      ready: false,
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
      // Snapshot the idle height, then switch to slider layout and pin it.
      drag.height = this._viewport?.offsetHeight ?? 0;
      this._dragging = true;
      void this.updateComplete.then(() => {
        const current = this._drag;
        const track = this._track;
        const viewport = this._viewport;
        if (!current?.active || !track || !viewport) {
          return;
        }
        track.style.transition = 'none';
        viewport.style.transition = 'none';
        viewport.style.height = `${current.height}px`;
        current.ready = true;
        this._applyDragTransform(current.dx);
      });
    }
    const count = this._config?.segments.length ?? 1;
    const step = (dx < 0 ? 1 : -1) * (this._rtl ? -1 : 1);
    const target = this._active + step;
    // Rubber-band resistance at the edges.
    drag.dx = target < 0 || target > count - 1 ? dx * 0.25 : dx;
    if (drag.ready) {
      this._applyDragTransform(drag.dx);
    }
  }

  private _onPointerUp(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.id) {
      return;
    }
    this._drag = undefined;
    if (!drag.active) {
      return;
    }
    this._suppressClick = true;
    window.setTimeout(() => {
      this._suppressClick = false;
    }, 150);
    const count = this._config?.segments.length ?? 1;
    const elapsed = Math.max(1, performance.now() - drag.t0);
    const velocity = drag.dx / elapsed;
    const step = (drag.dx < 0 ? 1 : -1) * (this._rtl ? -1 : 1);
    // Advance on a long drag, or on a quick flick that still travelled a real distance.
    const shouldMove =
      Math.abs(drag.dx) > drag.width * 0.2 ||
      (Math.abs(velocity) > 0.35 && Math.abs(drag.dx) > 24);
    const target = this._active + (shouldMove ? step : 0);
    void this._settleDrag(shouldMove && target >= 0 && target < count ? target : null);
  }

  private _onPointerCancel(e: PointerEvent): void {
    const drag = this._drag;
    if (!drag || e.pointerId !== drag.id) {
      return;
    }
    this._drag = undefined;
    if (drag.active) {
      void this._settleDrag(null);
    }
  }

  /** Animate the dragged track to its final position, then back to static layout. */
  private async _settleDrag(target: number | null): Promise<void> {
    if (target !== null && target !== this._active) {
      this._commitSelect(target);
    }
    await this.updateComplete;
    const track = this._track;
    const viewport = this._viewport;
    const duration = this._duration();
    if (track && viewport && duration > 0) {
      track.style.transition = '';
      viewport.style.transition = '';
      const factor = this._rtl ? 1 : -1;
      track.style.transform = `translateX(${factor * this._active * 100}%)`;
      const panel = this.renderRoot.querySelectorAll<HTMLElement>('.panel')[this._active];
      if (panel) {
        viewport.style.height = `${panel.offsetHeight}px`;
      }
      await wait(duration + 60);
    }
    this._dragging = false;
  }

  private _applyDragTransform(offsetPx: number): void {
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
      touch-action: pan-y;
    }

    .viewport.anim {
      overflow: hidden;
      transition: height var(--deck-duration) var(--deck-ease);
    }

    .viewport.no-swipe {
      touch-action: auto;
    }

    /* Idle: only the active panel exists in flow — no transforms anywhere,
       so position:fixed dialogs from child cards are not affected. */
    .track:not(.anim) > .panel:not(.active) {
      display: none;
    }

    .track.anim {
      display: flex;
      align-items: flex-start;
      will-change: transform;
      transition: transform var(--deck-duration) var(--deck-ease);
    }

    .track.anim > .panel {
      flex: 0 0 100%;
      width: 100%;
      min-width: 100%;
    }

    .panel {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--deck-card-gap, 8px);
    }

    .panel.columns {
      display: grid;
      grid-auto-flow: dense;
      grid-auto-rows: min-content;
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

/** Accepts a px number or any CSS length; returns a CSS length or undefined. */
function normalizeWidth(value: number | string | undefined): string | undefined {
  if (typeof value === 'number' && value > 0) {
    return `${value}px`;
  }
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return undefined;
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
