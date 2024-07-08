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
    const content =
      messages.length > 0
        ? messages
        : `You are an expert in popular writing in Xiaohongshu. Please use the
      the following steps to create and produce 1 text. After reading it
      completely and confirming that you follow all the requirements, please
      answer "I understand and am ready to accept input."`;

    console.log('content: ', content);
    return html`<div class="affine-ai-chat-block-container">
      <div class="ai-chat-item">
        <div class="ai-chat-user">
          <span class="user-avatar"></span>
          <span class="user-name">zanwei guo</span>
        </div>
        <div class="ai-chat-message">${content}</div>
      </div>
      <div class="ai-chat-block-button" @click=${this._openChatBlock}>
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
