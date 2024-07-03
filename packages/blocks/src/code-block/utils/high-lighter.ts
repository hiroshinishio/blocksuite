import {
  type BundledHighlighterOptions,
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type PlainTextLanguage,
} from 'shiki';

let _highLighter: Highlighter | null = null;

export const getHighlighterInstance = async (
  options: BundledHighlighterOptions<BundledLanguage, string> & {
    // Only support bundled languages
    langs: (BundledLanguage | PlainTextLanguage)[];
  }
) => {
  if (_highLighter) {
    const { langs } = options;
    if (langs) {
      await _highLighter.loadLanguage(...langs);
    }
    return _highLighter;
  }
  _highLighter = await createHighlighter({
    ...options,
  });
  return _highLighter;
};
