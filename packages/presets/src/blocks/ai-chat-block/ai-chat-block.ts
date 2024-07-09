import { BlockElement } from '@blocksuite/block-std';
import { peek, Peekable } from '@blocksuite/blocks';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { AffineAIIcon, ChatWithAIIcon } from '../_common/icon.js';
import type { AIChatBlockModel, ChatMessage } from './ai-chat-model.js';
import { styles } from './styles.js';

@customElement('affine-ai-chat')
@Peekable()
export class AIChatBlockComponent extends BlockElement<AIChatBlockModel> {
  static override styles = styles;

  private _openChatBlock = () => {
    peek(this);
  };

  UserInfo(message: ChatMessage) {
    const isUser = 'role' in message && message.role === 'user';

    return html`<div class="ai-chat-user">
      ${isUser
        ? html`<div class="user-avatar-container">
            ${message.userAvatarUrl
              ? html`<img .src=${message.userAvatarUrl} />`
              : html`<span class="default-avatar"></span>`}
          </div>`
        : html`<span class="ai-icon">${AffineAIIcon}</span>`}
      <span class="user-name">${isUser ? message.userName : 'AFFiNE AI'}</span>
    </div>`;
  }

  // private _getChatMessages = () => {
  //   return JSON.parse(this.model.messages) as ChatMessage[];
  // };

  open = () => {
    console.log('open chat block in center peek');
  };

  override renderBlock() {
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
      <div class="ai-chat-messages">
        <div class="ai-chat-message">
          <div class="ai-chat-user">
            <div class="user-avatar-container">
              <div class="default-avatar"></div>
            </div>
            <span class="user-name">zanwei guo</span>
          </div>
          <div class="ai-chat-content">${content}</div>
        </div>
        <div class="ai-chat-message">
          <div class="ai-chat-user">
            <div class="user-avatar-container">
              <div class="ai-icon">${AffineAIIcon}</div>
            </div>
            <span class="user-name">AFFiNE AI</span>
          </div>
          <div class="ai-chat-content">${content}</div>
        </div>
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
