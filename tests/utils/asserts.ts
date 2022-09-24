/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { expect, type Page } from '@playwright/test';
import type { BaseBlockModel, SerializedStore } from '../../packages/store';

export const defaultStore: SerializedStore = {
  blocks: {
    '0': {
      'sys:id': '0',
      'sys:flavour': 'page',
      'sys:children': ['1'],
    },
    '1': {
      'sys:flavour': 'text',
      'sys:id': '1',
      'sys:children': [],
      'prop:text': 'hello',
    },
  },
};

export async function assertEmpty(page: Page) {
  const actual = await page.locator('text-block-element').count();
  expect(actual).toBe(0);
}

export async function assertTitle(page: Page, text: string) {
  const locator = page.locator('input').nth(0);
  const actual = await locator.inputValue();
  expect(actual).toBe(text);
}

export async function assertText(page: Page, text: string) {
  const actual = await page.innerText('.ql-editor');
  expect(actual).toBe(text);
}

export async function assertRichTexts(page: Page, texts: string[]) {
  const actual = await page.locator('.ql-editor').allInnerTexts();
  expect(actual).toEqual(texts);
}

export async function assertBlockCount(
  page: Page,
  flavour: string,
  count: number
) {
  const actual = await page.locator(`${flavour}-block-element`).count();
  expect(actual).toBe(count);
}

export async function assertSelection(
  page: Page,
  richTextIndex: number,
  rangeIndex: number,
  rangeLength: number
) {
  const actual = await page.evaluate(
    ({ richTextIndex }) => {
      const quill =
        // @ts-ignore
        document.querySelectorAll('rich-text')[richTextIndex]?._quill!;
      return quill.getSelection();
    },
    { richTextIndex }
  );
  expect(actual).toEqual({ index: rangeIndex, length: rangeLength });
}

export async function assertSelectedBlockCount(page: Page, count: number) {
  const actual = await page.evaluate(() => {
    const selectLength =
      document.querySelector('page-container')?.selection.selectionInfo
        ?.selectedNodesIds?.length;
    return selectLength || 0;
  });
  expect(actual).toBe(count);
}

export async function assertStore(page: Page, expected: SerializedStore) {
  const actual = (await page.evaluate(() =>
    // @ts-ignore
    window.store.doc.toJSON()
  )) as SerializedStore;
  expect(actual).toEqual(expected);
}

export async function assertBlockChildrenIds(
  page: Page,
  blockId: string,
  ids: string[]
) {
  const actual = await page.evaluate(
    ({ blockId }) => {
      const element = document.querySelector(`[data-block-id="${blockId}"]`);
      // @ts-ignore
      const model = element.model as BaseBlockModel;
      return model.children.map(child => child.id);
    },
    { blockId }
  );
  expect(actual).toEqual(ids);
}

export async function assertBlockChildrenFlavours(
  page: Page,
  blockId: string,
  flavours: string[]
) {
  const actual = await page.evaluate(
    ({ blockId }) => {
      const element = document.querySelector(`[data-block-id="${blockId}"]`);
      // @ts-ignore
      const model = element.model as BaseBlockModel;
      return model.children.map(child => child.flavour);
    },
    { blockId }
  );
  expect(actual).toEqual(flavours);
}
