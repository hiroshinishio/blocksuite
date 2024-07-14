import './image-placeholder.js';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import { ImageLoadingFailedIcon, LoadingIcon } from '../../_common/icon.js';

@customElement('chat-image')
export class ChatImage extends LitElement {
  static override styles = css`
    .image-container {
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
      max-width: 320px;

      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }
  `;

  @property({ attribute: false })
  accessor imageUrl!: string;

  @property({ attribute: false })
  accessor status!: 'loading' | 'error' | 'success';

  override render() {
    return choose(this.status, [
      [
        'loading',
        () =>
          html`<image-placeholder
            .text=${'Loading image'}
            .icon=${LoadingIcon}
          ></image-placeholder>`,
      ],
      [
        'error',
        () =>
          html`<image-placeholder
            .text=${'Image Loading Failed'}
            .icon=${ImageLoadingFailedIcon}
          ></image-placeholder>`,
      ],
      [
        'success',
        () =>
          html`<div class="image-container">
            <img src=${this.imageUrl} />
          </div>`,
      ],
    ]);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-image': ChatImage;
  }
}
