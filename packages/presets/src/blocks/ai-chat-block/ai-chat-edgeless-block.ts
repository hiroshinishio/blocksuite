import { toEdgelessBlockElement } from '@blocksuite/block-std';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { AIChatBlockComponent } from './ai-chat-block.js';

@customElement('affine-edgeless-ai-chat')
export class EdgelessAIChatBlockComponent extends toEdgelessBlockElement(
  AIChatBlockComponent
) {
  rootServiceFlavour!: 'affine:page';

  override renderEdgelessBlock() {
    console.log('render edgeless ai chat block');
    const style = {
      transformOrigin: '0 0',
      boxShadow: 'var(--affine-shadow-1)',
      borderRadius: '8px',
    };

    return html`
      <div class="edgeless-ai-chat" style=${styleMap(style)}>
        ${this.renderPageContent()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-edgeless-ai-chat': EdgelessAIChatBlockComponent;
  }
}
