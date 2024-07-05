import { BlockElement } from '@blocksuite/block-std';
import { peek, Peekable } from '@blocksuite/blocks';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ChatWithAIIcon } from '../_common/icon.js';
import type { AIChatBlockModel } from './ai-chat-model.js';
import { styles } from './styles.js';

@customElement('affine-ai-chat')
@Peekable()
export class AIChatBlockComponent extends BlockElement<AIChatBlockModel> {
  static override styles = styles;

  private _openChatBlock = () => {
    peek(this);
  };

  // private _getChatMessages = () => {
  //   return JSON.parse(this.model.messages) as ChatMessage[];
  // };

  open = () => {
    console.log('open chat block in center peek');
  };

  override renderBlock() {
    console.log('render ai chat block');
    const { messages } = this.model;

    return html`<div class="affine-ai-chat-block-container">
      <div class="chat-item">
        <div class="chat-user">
          <span class="user-avatar"></span>
          <span class="user-name">zanwei guo</span>
        </div>
        <div class="chat-message">${messages}</div>
      </div>
      <div class="chat-block-button" @click=${this._openChatBlock}>
        ${ChatWithAIIcon} <span>AI chat block</span>
      </div>
    </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'affine-ai-chat': AIChatBlockComponent;
  }
}
