import './components/user-info.js';
import './components/chat-image.js';

import { BlockElement } from '@blocksuite/block-std';
import { peek, Peekable } from '@blocksuite/blocks';
import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { AffineAIIcon, ChatWithAIIcon } from '../_common/icon.js';
import type { AIChatBlockModel } from './ai-chat-model.js';
import { styles } from './styles.js';
import { type ChatMessage, ChatMessagesSchema } from './types.js';

@customElement('affine-ai-chat')
@Peekable()
export class AIChatBlockComponent extends BlockElement<AIChatBlockModel> {
  static override styles = styles;

  private _openChatBlock = () => {
    peek(this);
  };

  // Deserialize messages from JSON string and verify the type using zod
  private _deserializeChatMessages = (messages: string) => {
    const result = ChatMessagesSchema.safeParse(JSON.parse(messages));
    if (result.success) {
      return result.data;
    } else {
      return [];
    }
  };

  UserInfo(message: ChatMessage) {
    const isUser = 'role' in message && message.role === 'user';

    const userInfoTemplate = isUser
      ? html`<user-info
          .userName=${message.userName ?? 'You'}
          .avatarUrl=${message.avatarUrl}
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
    const messages = this._deserializeChatMessages(this.model.messages).slice(
      -2
    );

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
