import '../buttons/tool-icon-button.js';
import '../buttons/toolbar-button.js';
import './present/frame-order-button.js';
import './presentation-toolbar.js';

import { WithDisposable } from '@blocksuite/block-std';
import { debounce } from '@blocksuite/global/utils';
import { Slot } from '@blocksuite/store';
import { offset } from '@floating-ui/dom';
import { consume } from '@lit/context';
import { baseTheme } from '@toeverything/theme';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import {
  type MenuHandler,
  popMenu,
} from '../../../../_common/components/index.js';
import {
  ArrowLeftSmallIcon,
  ArrowRightSmallIcon,
  MoreHorizontalIcon,
} from '../../../../_common/icons/index.js';
import type { EdgelessTool } from '../../../../_common/types.js';
import { stopPropagation } from '../../../../_common/utils/event.js';
import { edgelessToolContext } from '../../edgeless-root.context.js';
import type { EdgelessRootBlockComponent } from '../../edgeless-root-block.js';
import { getQuickTools, getSeniorTools } from './tools.js';

const TOOLBAR_PADDING_X = 12;
const TOOLBAR_HEIGHT = 64;
const QUICK_TOOLS_GAP = 10;
const QUICK_TOOL_SIZE = 36;
const QUICK_TOOL_MORE_SIZE = 20;
const SENIOR_TOOLS_GAP = 0;
const SENIOR_TOOL_WIDTH = 96;
const SENIOR_TOOL_NAV_SIZE = 20;
const DIVIDER_WIDTH = 8;
const DIVIDER_SPACE = 8;
const SAFE_AREA_WIDTH = 64;

@customElement('edgeless-toolbar')
export class EdgelessToolbar extends WithDisposable(LitElement) {
  static override styles = css`
    :host {
      font-family: ${unsafeCSS(baseTheme.fontSansFamily)};
      position: absolute;
      z-index: 1;
      left: calc(50%);
      transform: translateX(-50%);
      bottom: 0;
      -webkit-user-select: none;
      user-select: none;
      width: 100%;
    }

    .edgeless-toolbar-toggle-control {
      width: 100%;
      display: flex;
      justify-content: center;
      padding-bottom: 28px;
      pointer-events: auto;
    }
    .edgeless-toolbar-toggle-control[data-enable='true'] {
      transition: 0.23s ease;
      padding-top: 100px;
      transform: translateY(100px);
    }
    .edgeless-toolbar-toggle-control[data-enable='true']:hover {
      padding-top: 0;
      transform: translateY(0);
    }

    .edgeless-toolbar-container {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 ${unsafeCSS(TOOLBAR_PADDING_X)}px;
      background: var(--affine-background-overlay-panel-color);
      box-shadow: var(--affine-shadow-2);
      border: 1px solid var(--affine-border-color);
      border-radius: 16px;
      width: fit-content;
      max-width: calc(100% - ${unsafeCSS(SAFE_AREA_WIDTH)}px * 2);
      height: ${unsafeCSS(TOOLBAR_HEIGHT)}px;
    }
    :host([disabled]) .edgeless-toolbar-toggle-control {
      pointer-events: none;
    }
    .edgeless-toolbar-container[level='second'] {
      position: absolute;
      bottom: 8px;
      transform: translateY(-100%);
    }
    .edgeless-toolbar-container[hidden] {
      display: none;
    }
    .quick-tools {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${unsafeCSS(QUICK_TOOLS_GAP)}px;
    }
    .full-divider {
      width: ${unsafeCSS(DIVIDER_WIDTH)}px;
      height: 100%;
      margin: 0 ${unsafeCSS(DIVIDER_SPACE)}px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .full-divider::after {
      content: '';
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--affine-border-color);
    }
    .brush-and-eraser {
      display: flex;
    }
    .senior-tools {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: ${unsafeCSS(SENIOR_TOOLS_GAP)}px;
      height: 100%;
      min-width: ${unsafeCSS(SENIOR_TOOL_WIDTH)}px;
    }
    .quick-tool-item {
      width: ${unsafeCSS(QUICK_TOOL_SIZE)}px;
      height: ${unsafeCSS(QUICK_TOOL_SIZE)}px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .quick-tool-more {
      width: 0;
      height: ${unsafeCSS(QUICK_TOOL_SIZE)}px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.23s ease;
      overflow: hidden;
    }
    [data-dense-quick='true'] .quick-tool-more {
      width: ${unsafeCSS(QUICK_TOOL_MORE_SIZE)}px;
      margin-left: ${unsafeCSS(DIVIDER_SPACE)}px;
    }
    .quick-tool-more-button {
      padding: 0;
    }

    .senior-tool-item {
      width: ${unsafeCSS(SENIOR_TOOL_WIDTH)}px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .senior-nav-button-wrapper {
      flex-shrink: 0;
      width: 0px;
      height: ${unsafeCSS(SENIOR_TOOL_NAV_SIZE)}px;
      transition: width 0.23s ease;
      overflow: hidden;
    }
    .senior-nav-button {
      padding: 0;
    }
    [data-dense-senior='true'] .senior-nav-button-wrapper {
      width: ${unsafeCSS(SENIOR_TOOL_NAV_SIZE)}px;
    }
    [data-dense-senior='true'] .senior-nav-button-wrapper.prev {
      margin-right: ${unsafeCSS(DIVIDER_SPACE)}px;
    }
    [data-dense-senior='true'] .senior-nav-button-wrapper.next {
      margin-left: ${unsafeCSS(DIVIDER_SPACE)}px;
    }
    .transform-button svg {
      transition: 0.3s ease-in-out;
    }
    .transform-button:hover svg {
      transform: scale(1.15);
    }
  `;

  edgeless: EdgelessRootBlockComponent;

  public readonly slots = {
    resize: new Slot<{ w: number; h: number }>(),
  };

  constructor(edgeless: EdgelessRootBlockComponent) {
    super();
    this.edgeless = edgeless;
  }

  private get _cachedPresentHideToolbar() {
    return !!this.edgeless.service.editPropsStore.getItem('presentHideToolbar');
  }

  @state()
  accessor containerWidth = 0;
  @state()
  accessor presentSettingMenuShow = false;
  @state()
  accessor presentFrameMenuShow = false;
  @state()
  accessor scrollSeniorToolIndex = 0;

  private _resizeObserver: ResizeObserver | null = null;

  /**
   * When enabled, the toolbar will auto-hide when the mouse is not over it.
   */
  private get _enableAutoHide() {
    return (
      this.edgelessTool?.type === 'frameNavigator' &&
      this._cachedPresentHideToolbar &&
      !this.presentSettingMenuShow &&
      !this.presentFrameMenuShow
    );
  }
  get host() {
    return this.edgeless.host;
  }

  @consume({ context: edgelessToolContext, subscribe: true })
  accessor edgelessTool!: EdgelessTool;

  setEdgelessTool = (edgelessTool: EdgelessTool) => {
    this.edgeless.tools.setEdgelessTool(edgelessTool);
  };

  private _onSeniorNavPrev() {
    if (this._seniorScrollPrevDisabled) return;
    this.scrollSeniorToolIndex = Math.max(
      0,
      this.scrollSeniorToolIndex - this.scrollSeniorToolSize
    );
  }

  private _onSeniorNavNext() {
    if (this._seniorScrollNextDisabled) return;
    this.scrollSeniorToolIndex = Math.min(
      this._seniorTools.length - this.scrollSeniorToolSize,
      this.scrollSeniorToolIndex + this.scrollSeniorToolSize
    );
  }

  private _moreQuickToolsMenu: MenuHandler | null = null;
  private _moreQuickToolsMenuRef: HTMLElement | null = null;
  private _onContainerResize = debounce(({ w }: { w: number }) => {
    this.slots.resize.emit({ w, h: TOOLBAR_HEIGHT });
    this.containerWidth = w;

    if (this._denseSeniorTools) {
      this.scrollSeniorToolIndex = Math.min(
        this._seniorTools.length - this.scrollSeniorToolSize,
        this.scrollSeniorToolIndex
      );
    } else {
      this.scrollSeniorToolIndex = 0;
    }

    if (
      this._denseQuickTools &&
      this._moreQuickToolsMenu &&
      this._moreQuickToolsMenuRef
    ) {
      this._moreQuickToolsMenu.close();
      this._openMoreQuickToolsMenu({
        currentTarget: this._moreQuickToolsMenuRef,
      });
    }
  }, 100);

  private _openMoreQuickToolsMenu(e: { currentTarget: HTMLElement }) {
    if (!this._hiddenQuickTools.length) return;

    this._moreQuickToolsMenuRef = e.currentTarget;
    this._moreQuickToolsMenu = popMenu(e.currentTarget as HTMLElement, {
      placement: 'top',
      middleware: [
        offset({
          mainAxis: (TOOLBAR_HEIGHT - QUICK_TOOL_MORE_SIZE) / 2 + 8,
        }),
      ],
      options: {
        onClose: () => {
          this._moreQuickToolsMenu = null;
          this._moreQuickToolsMenuRef = null;
        },
        items: this._hiddenQuickTools.map(tool => tool.menu!),
      },
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        this._onContainerResize({ w: width });
      }
    });
    this._resizeObserver.observe(this);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }
  override firstUpdated() {
    const { _disposables, edgeless } = this;

    _disposables.add(
      edgeless.service.viewport.viewportUpdated.on(() => this.requestUpdate())
    );
    _disposables.add(
      edgeless.slots.readonlyUpdated.on(() => {
        this.requestUpdate();
      })
    );
    _disposables.add(
      edgeless.slots.toolbarLocked.on(disabled => {
        this.toggleAttribute('disabled', disabled);
      })
    );
    // This state from `editPropsStore` is not reactive,
    // if the value is updated outside of this component, it will not be reflected.
    _disposables.add(
      this.edgeless.service.editPropsStore.slots.itemUpdated.on(({ key }) => {
        if (key === 'presentHideToolbar') {
          this.requestUpdate();
        }
      })
    );
  }

  private get _seniorTools() {
    return getSeniorTools({ edgeless: this.edgeless });
  }

  private get _quickTools() {
    return getQuickTools({ edgeless: this.edgeless });
  }

  // calculate all the width manually
  private get _availableWidth() {
    return this.containerWidth - 2 * SAFE_AREA_WIDTH;
  }
  private get _quickToolsWidthTotal() {
    return (
      this._quickTools.length * (QUICK_TOOL_SIZE + QUICK_TOOLS_GAP) -
      QUICK_TOOLS_GAP
    );
  }
  private get _seniorToolsWidthTotal() {
    return (
      this._seniorTools.length * (SENIOR_TOOL_WIDTH + SENIOR_TOOLS_GAP) -
      SENIOR_TOOLS_GAP
    );
  }
  private get _spaceWidthTotal() {
    return DIVIDER_WIDTH + DIVIDER_SPACE * 2 + TOOLBAR_PADDING_X * 2;
  }
  private get _denseSeniorTools() {
    return (
      this._availableWidth -
        this._quickToolsWidthTotal -
        this._spaceWidthTotal <
      this._seniorToolsWidthTotal
    );
  }
  private get _seniorToolNavWidth() {
    return this._denseSeniorTools
      ? (SENIOR_TOOL_NAV_SIZE + DIVIDER_SPACE) * 2
      : 0;
  }
  private get _denseQuickTools() {
    return (
      this._availableWidth -
        this._seniorToolNavWidth -
        1 * SENIOR_TOOL_WIDTH -
        2 * TOOLBAR_PADDING_X <
      this._quickToolsWidthTotal
    );
  }
  private get _visibleQuickToolSize() {
    if (!this._denseQuickTools) return this._quickTools.length;
    const availableWidth =
      this._availableWidth -
      this._seniorToolNavWidth -
      this._spaceWidthTotal -
      SENIOR_TOOL_WIDTH;
    return Math.max(
      1,
      Math.floor(
        (availableWidth - QUICK_TOOL_MORE_SIZE - DIVIDER_SPACE) /
          (QUICK_TOOL_SIZE + QUICK_TOOLS_GAP)
      )
    );
  }
  private get _hiddenQuickTools() {
    return this._quickTools
      .slice(this._visibleQuickToolSize)
      .filter(tool => !!tool.menu);
  }

  get scrollSeniorToolSize() {
    if (this._denseQuickTools) return 1;
    const seniorAvailableWidth =
      this._availableWidth - this._quickToolsWidthTotal - this._spaceWidthTotal;
    if (seniorAvailableWidth >= this._seniorToolsWidthTotal)
      return this._seniorTools.length;
    return (
      Math.floor(
        (seniorAvailableWidth - (SENIOR_TOOL_NAV_SIZE + DIVIDER_SPACE) * 2) /
          SENIOR_TOOL_WIDTH
      ) || 1
    );
  }

  private get _seniorScrollPrevDisabled() {
    return this.scrollSeniorToolIndex === 0;
  }
  private get _seniorScrollNextDisabled() {
    return (
      this.scrollSeniorToolIndex + this.scrollSeniorToolSize >=
      this._seniorTools.length
    );
  }

  private _renderContent() {
    return html`
      <div class="quick-tools">
        ${this._quickTools
          .slice(0, this._visibleQuickToolSize)
          .map(
            tool => html`<div class="quick-tool-item">${tool.content}</div>`
          )}
      </div>
      <div class="quick-tool-more">
        <icon-button
          ?disabled=${!this._denseQuickTools}
          .size=${20}
          class="quick-tool-more-button"
          @click=${this._openMoreQuickToolsMenu}
        >
          ${MoreHorizontalIcon}
        </icon-button>
      </div>
      <div class="full-divider"></div>
      <div class="senior-nav-button-wrapper prev">
        <icon-button
          .size=${20}
          class="senior-nav-button"
          ?disabled=${this._seniorScrollPrevDisabled}
          @click=${this._onSeniorNavPrev}
        >
          ${ArrowLeftSmallIcon}
        </icon-button>
      </div>
      <div class="senior-tools">
        ${this._seniorTools
          .slice(
            this.scrollSeniorToolIndex,
            this.scrollSeniorToolIndex + this.scrollSeniorToolSize
          )
          .map(
            (tool, i) =>
              html`<div
                class="senior-tool-item"
                style="background: rgba(100, 100, 100, ${0.05 * (i + 1)})"
              >
                ${tool.content}
              </div>`
          )}
      </div>
      <div class="senior-nav-button-wrapper next">
        <icon-button
          .size=${20}
          class="senior-nav-button"
          ?disabled=${this._seniorScrollNextDisabled}
          @click=${this._onSeniorNavNext}
        >
          ${ArrowRightSmallIcon}
        </icon-button>
      </div>
    `;
  }

  override render() {
    const { type } = this.edgelessTool || {};
    if (this.edgeless.doc.readonly && type !== 'frameNavigator') {
      return nothing;
    }

    return html`
      <div
        class="edgeless-toolbar-toggle-control"
        data-enable=${this._enableAutoHide}
      >
        <div
          class="edgeless-toolbar-container"
          data-dense-quick=${this._denseQuickTools &&
          this._hiddenQuickTools.length > 0}
          data-dense-senior=${this._denseSeniorTools}
          @dblclick=${stopPropagation}
          @mousedown=${stopPropagation}
          @pointerdown=${stopPropagation}
        >
          <presentation-toolbar
            .visible=${type === 'frameNavigator'}
            .edgeless=${this.edgeless}
            .settingMenuShow=${this.presentSettingMenuShow}
            .frameMenuShow=${this.presentFrameMenuShow}
            .setSettingMenuShow=${(show: boolean) =>
              (this.presentSettingMenuShow = show)}
            .setFrameMenuShow=${(show: boolean) =>
              (this.presentFrameMenuShow = show)}
          ></presentation-toolbar>
          ${type === 'frameNavigator' ? nothing : this._renderContent()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-toolbar': EdgelessToolbar;
  }
}
