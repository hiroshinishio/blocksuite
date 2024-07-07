import { type BlockServiceOptions, container } from '@blocksuite/block-std';

import type { DocModeService } from '../../_common/services/doc-mode/interface.js';
import { TYPES } from '../../_common/services/types.js';
import { RootBlockSchema } from '../root-model.js';
import { PageRootService } from './page-root-service.js';

container
  .bind<PageRootService>(RootBlockSchema.model.flavour)
  .toDynamicValue(context => {
    return (options: BlockServiceOptions) => {
      const docModeService = context.container.get<DocModeService>(
        TYPES.DocMode
      );
      return new PageRootService(docModeService, options);
    };
  });

// TODO lifecycle
