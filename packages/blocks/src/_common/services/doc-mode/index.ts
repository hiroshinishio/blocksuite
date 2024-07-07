import { container } from '@blocksuite/block-std';

import { TYPES } from '../types.js';
import { DocModeServiceImpl } from './impl.js';
import type { DocModeService } from './interface.js';

export * from './interface.js';

container
  .bind<DocModeService>(TYPES.DocMode)
  .to(DocModeServiceImpl)
  .inSingletonScope();
