import type {
  BundledLanguage,
  BundledTheme,
  Highlighter,
  PlainTextLanguage,
} from 'shiki';

import { getThemeMode } from '../../../_common/utils/query.js';
import { DARK_THEME, LIGHT_THEME } from '../consts.js';
import type { CodeTokenizer } from './tokenizer.js';

export interface AffineCodeEditorOptions {
  lang: BundledLanguage | PlainTextLanguage;
}

export class AffineCodeEditor {
  private _language: BundledLanguage | PlainTextLanguage = 'plaintext';

  private _theme: BundledTheme;

  private _highlighter: Highlighter | null = null;

  private _tokenizer: CodeTokenizer | null = null;

  constructor(options: AffineCodeEditorOptions) {
    this.setLanguage(options.lang);
    this._theme = getThemeMode() === 'dark' ? DARK_THEME : LIGHT_THEME;
  }

  setLanguage(lang: BundledLanguage | PlainTextLanguage) {
    // todo handle plain text
    if (this._language === lang) return;
    this._language = lang;
  }

  setTheme(theme: BundledTheme) {
    this._theme = theme;
  }

  editLine(code: string, lineNumber: number) {
    // TODO throw

    if (!this._tokenizer || !this._highlighter) return;

    return this._tokenizer.tokenizeLine(
      { code, index: lineNumber },
      {
        theme: this._theme,
        highlighter: this._highlighter,
        lang: this._language,
      }
    );
  }

  init(highlighter: Highlighter) {
    this._highlighter = highlighter;
  }
}
