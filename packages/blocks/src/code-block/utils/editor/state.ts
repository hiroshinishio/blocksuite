import type { GrammarState } from 'shiki';

import { FixedArray } from './fixedArray.js';

export class CodeTokenizerStateStore {
  private readonly _lineEndStates = new FixedArray<GrammarState | null>(null);

  getLineEndState(lineNumber: number): GrammarState | null {
    return this._lineEndStates.get(lineNumber);
  }

  setLineEndState(lineNumber: number, state: GrammarState): boolean {
    const oldState = this._lineEndStates.get(lineNumber);
    if (oldState && grammarStateEqual(oldState, state)) {
      return false;
    }
    this._lineEndStates.set(lineNumber, state);
    return true;
  }
}

export function grammarStateEqual(a: GrammarState, b: GrammarState) {
  return (
    a.lang === b.lang &&
    a.theme === b.theme &&
    a.scopes.every((scope, index) => b.scopes[index] === scope)
  );
}
