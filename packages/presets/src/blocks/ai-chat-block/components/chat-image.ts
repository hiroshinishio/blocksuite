import './image-placeholder.js';

import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
  accessor blobId!: string;

  @property({ attribute: false })
  accessor imageUrl: string | null = null;

  @property({ attribute: false })
  accessor loading: boolean = false;

  @property({ attribute: false })
  accessor error: boolean = false;

  async fetchImageUrl(blobId: string) {
    this.loading = true;
    try {
      // Replace with your actual fetch logic
      const response = await fetch(`/api/images/${blobId}`);
      const data = await response.json();
      this.imageUrl = data.url;
      this.error = false;
    } catch (e) {
      console.error(e);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.fetchImageUrl(this.blobId).catch(console.error);
  }

  override render() {
    return html`
      ${this.loading
        ? html`<image-placeholder
            .text=${'Loading image'}
            .icon=${LoadingIcon}
          ></image-placeholder>`
        : this.error
          ? html`<image-placeholder
              .text=${'Image Loading Failed'}
              .icon=${ImageLoadingFailedIcon}
            ></image-placeholder>`
          : html`<div class="image-container">
              <img src=${this.imageUrl} />
            </div>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-image': ChatImage;
  }
}
