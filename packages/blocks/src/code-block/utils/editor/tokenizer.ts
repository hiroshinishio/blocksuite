import type {
  BundledLanguage,
  BundledTheme,
  GrammarState,
  Highlighter,
  PlainTextLanguage,
  ThemedToken,
} from 'shiki';

import { CodeTokenizerStateStore } from './state.js';

export interface CodeLine {
  code: string;
  index: number;
}

export class TokenizationResult {
  constructor(
    readonly tokens: ThemedToken[],
    readonly endState?: GrammarState
  ) {}
}
export interface CodeTokenizerOptions {
  highlighter: Highlighter;
  theme: BundledTheme;
  lang: BundledLanguage | PlainTextLanguage;
}

export class CodeTokenizer {
  private _stateStore = new CodeTokenizerStateStore();

  private _cache = new Map<string, TokenizationResult>();

  private _tokenizeLine(
    line: CodeLine,
    state: GrammarState | undefined,
    { highlighter, theme, lang }: CodeTokenizerOptions
  ): TokenizationResult {
    // FIXME
    const { code, index: lineNumber } = line;
    const tokens = highlighter.codeToTokensBase(code, {
      theme,
      lang,
      grammarState: state,
    })[0];

    const grammarState = highlighter.getLastGrammarState(code, {
      theme,
      lang,
      grammarState: state,
    });

    this._stateStore.setLineEndState(lineNumber, grammarState);

    const res = new TokenizationResult(tokens);
    this._cache.set(`${lineNumber}-${code}`, res);
    return res;
  }

  tokenizeLine(line: CodeLine, options: CodeTokenizerOptions) {
    const lineNumber = line.index;

    const prevLineState =
      lineNumber > 0
        ? this._stateStore.getLineEndState(lineNumber - 1) ?? undefined
        : undefined;

    const res = this._tokenizeLine(line, prevLineState, options);
    return res.tokens;
  }
}
