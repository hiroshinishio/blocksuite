import './components/user-info.js';
import './components/chat-image.js';

import { BlockElement } from '@blocksuite/block-std';
import { peek, Peekable } from '@blocksuite/blocks';
import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

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

  private _getChatMessages = (messages: string) => {
    return JSON.parse(messages) as ChatMessage[];
  };

  generateMockChatMessage(
    role: 'user' | 'assistant',
    withAttachment = false
  ): ChatMessage {
    return {
      content:
        role === 'user'
          ? 'You are an expert in popular writing in Xiaohongshu. Please use the following steps to create and produce 1 text. After reading it completely and confirming that you follow all the requirements, please answer "I understand and am ready to accept input."'
          : 'I understand and am ready to accept input.',
      role: role,
      createdAt: new Date().toISOString(),
      attachments: withAttachment
        ? ['jdhhbhjbvhjdjdvbsj', 'jdhhbhjbvhjdjdvbsj']
        : undefined,
      userId: role === 'user' ? 'vbdjbvshvjsdbvjs' : undefined,
      userName: role === 'user' ? 'Zanwei Guo' : undefined,
      userAvatarUrl: role === 'user' ? 'vsdvhbsjdvbdjhbvsjdb' : undefined,
    };
  }

  generateMockMessages(count: number): string {
    const messages: ChatMessage[] = [];
    for (let i = 0; i < count; i++) {
      const role: 'user' | 'assistant' = i % 2 === 0 ? 'user' : 'assistant';
      messages.push(this.generateMockChatMessage(role, true));
    }
    return JSON.stringify(messages);
  }

  UserInfo(message: ChatMessage) {
    const isUser = 'role' in message && message.role === 'user';

    const userInfoTemplate = isUser
      ? html`<user-info
          .userName=${message.userName ?? 'You'}
          .avatarUrl=${message.userAvatarUrl}
        ></user-info>`
      : html`<user-info
          .userName=${'AFFiNE AI'}
          .avatarIcon=${AffineAIIcon}
        ></user-info>`;

    return userInfoTemplate;
  }

  ChatImages(attachments: string[] | undefined) {
    if (!attachments || attachments.length === 0) {
      return nothing;
    }

    return html`<div class="images-container">
      ${repeat(
        attachments,
        attachment => attachment,
        attachment => html`<chat-image .blobId=${attachment}></chat-image>`
      )}
    </div>`;
  }

  override renderBlock() {
    const mockMessages = this.generateMockMessages(2);
    // get the last two messages
    const messages = this._getChatMessages(mockMessages).slice(-2);

    return html`<div class="affine-ai-chat-block-container">
      <div class="ai-chat-messages">
        ${repeat(
          messages,
          message => message.createdAt,
          message => html`
            <div class="ai-chat-message">
              ${this.UserInfo(message)}
              <div class="ai-chat-content">
                ${this.ChatImages(message.attachments)}
                <div>${message.content}</div>
              </div>
            </div>
          `
        )}
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
