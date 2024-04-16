import './action-wrapper.js';
import '../../widgets/messages/slides-renderer.js';

import type { EditorHost } from '@blocksuite/block-std';
import { ShadowlessElement, WithDisposable } from '@blocksuite/block-std';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { ChatAction } from '../index.js';

@customElement('action-slides')
export class ActionSlides extends WithDisposable(ShadowlessElement) {
  @property({ attribute: false })
  item!: ChatAction;

  @property({ attribute: false })
  host!: EditorHost;

  protected override render() {
    const answer = this.item.messages[2]?.content;
    if (!answer) return nothing;

    return html`<action-wrapper .host=${this.host} .item=${this.item}>
      <div style=${styleMap({ marginBottom: '12px', height: '174px' })}>
        <ai-slides-renderer
          .text=${answer}
          .host=${this.host}
        ></ai-slides-renderer>
      </div>
    </action-wrapper>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'action-slides': ActionSlides;
  }
}
