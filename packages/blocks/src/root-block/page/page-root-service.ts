import { Slot } from '@blocksuite/store';
import { injectable } from 'inversify';

import type { Viewport } from '../../_common/utils/index.js';
import { RootService } from '../root-service.js';

@injectable()
export class PageRootService extends RootService {
  slots = {
    docLinkClicked: new Slot<{
      docId: string;
      blockId?: string;
    }>(),
    tagClicked: new Slot<{
      tagId: string;
    }>(),
    viewportUpdated: new Slot<Viewport>(),
  };
}
