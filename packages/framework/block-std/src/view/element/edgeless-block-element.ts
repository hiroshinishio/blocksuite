import type { BlockModel } from '@blocksuite/store';
import { nothing } from 'lit';

import type { SerializedXYWH } from '../../edgeless/types.js';
import type { BlockService } from '../../service/index.js';
import { BlockElement } from './block-element.js';

export const edgelessElementSymbol = Symbol('edgelessElement');

export abstract class EdgelessBlockElement<
  EdgelessRootService extends BlockService = BlockService,
  Model extends BlockModel = BlockModel,
  Service extends BlockService = BlockService,
  WidgetName extends string = string,
> extends BlockElement<Model, Service, WidgetName> {
  [edgelessElementSymbol] = true;

  abstract rootServiceFlavour: string;

  get rootService() {
    return this.host.spec.getService(
      this.rootServiceFlavour
    ) as EdgelessRootService;
  }

  toZIndex(_: string): string {
    return `${1}`;
  }

  getRenderingRect() {
    const { xywh, index } = this.model as BlockModel<{
      xywh: SerializedXYWH;
      index: string;
    }>;

    if (!xywh) {
      throw new Error('Edgeless block should have at least `xywh` property.');
    }

    const [x, y, w, h] = JSON.parse(xywh);

    return { x, y, w, h, zIndex: this.toZIndex(index) };
  }

  override renderBlock() {
    const { xywh, index } = this.model as BlockModel<{
      xywh: SerializedXYWH;
      index: string;
    }>;

    if (!xywh || !index) {
      throw new Error(
        'Edgeless block should have at least `xywh` and `index` properties.'
      );
    }

    const { x, y, w, h, zIndex } = this.getRenderingRect();

    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
    this.style.width = `${w}px`;
    this.style.height = `${h}px`;
    this.style.zIndex = zIndex;

    return this.renderEdgelessBlock();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.style.position = 'absolute';
  }

  renderPageContent() {
    return nothing;
  }

  renderEdgelessBlock(): unknown {
    return nothing;
  }
}

// @ts-ignore
export function toEdgelessBlockElement<
  EdgelessRootService extends BlockService,
  Model extends BlockModel,
  Service extends BlockService,
  WidgetName extends string,
  B extends typeof BlockElement<Model, Service, WidgetName>,
>(CustomBlock: B) {
  // @ts-ignore
  return class extends CustomBlock {
    [edgelessElementSymbol] = true;

    rootServiceFlavour!: string;

    get rootService() {
      return this.host.spec.getService(
        this.rootServiceFlavour
      ) as EdgelessRootService;
    }

    toZIndex(_: string): string {
      return `${1}`;
    }

    getRenderingRect(): {
      x: number;
      y: number;
      w: number | string;
      h: number | string;
      zIndex: string;
    } {
      const { xywh, index } = this.model as BlockModel<{
        xywh: SerializedXYWH;
        index: string;
      }>;

      if (!xywh) {
        throw new Error('Edgeless block should have at least `xywh` property.');
      }

      const [x, y, w, h] = JSON.parse(xywh);

      return { x, y, w, h, zIndex: this.toZIndex(index) };
    }

    override renderBlock() {
      console.log('render edgeless block: ', this.model.flavour);
      const { xywh, index } = this.model as BlockModel<{
        xywh: SerializedXYWH;
        index: string;
      }>;

      if (!xywh || !index) {
        throw new Error(
          'Edgeless block should have at least `xywh` and `index` properties.'
        );
      }

      const { x, y, w, h, zIndex } = this.getRenderingRect();

      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
      this.style.width = typeof w === 'number' ? `${w}px` : w;
      this.style.height = typeof h === 'number' ? `${h}px` : h;
      this.style.zIndex = zIndex;

      return this.renderEdgelessBlock();
    }

    override connectedCallback(): void {
      super.connectedCallback();

      this.style.position = 'absolute';
    }

    renderPageContent() {
      return super.renderBlock();
    }

    renderEdgelessBlock(): unknown {
      return this.renderPageContent();
    }
  } as B & {
    new (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ): EdgelessBlockElement<EdgelessRootService>;
  };
}
