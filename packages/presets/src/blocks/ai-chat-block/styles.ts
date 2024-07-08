import { baseTheme } from '@toeverything/theme';
import { css, unsafeCSS } from 'lit';

export const styles = css`
  .affine-ai-chat-block-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 16px;
    background: var(--affine-white);
    color: var(--affine-text-primary-color);
    line-height: 22px;
    font-size: var(--affine-font-sm);
    font-family: ${unsafeCSS(baseTheme.fontSansFamily)};
    border-radius: 8px;

    .ai-chat-item,
    .ai-chat-block-button {
      display: flex;
      width: 100%;
    }
    .ai-chat-item {
      flex-direction: column;
      flex: 1 0 0;
      gap: 4px;
    }
    .ai-chat-user,
    .ai-chat-message {
      display: flex;
      width: 100%;
    }
    .ai-chat-user {
      height: 24px;
      flex-direction: row;
      gap: 10px;
      font-weight: 500;
      .user-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--affine-primary-color);
      }
    }

    .ai-chat-message {
      padding-left: 34px;
      font-weight: 400;
      overflow: hidden;
      flex: 1 0 0;
      -webkit-mask-image: linear-gradient(
        to bottom,
        black 50%,
        transparent 100%
      );
      mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
    }
    .ai-chat-block-button {
      height: 22px;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      cursor: pointer;
      svg {
        color: var(--affine-icon-color);
      }
    }
  }
`;
