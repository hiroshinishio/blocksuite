import { Slot } from '@blocksuite/global/utils';
import { injectable } from 'inversify';

import type { DocMode } from '../../types.js';
import type { DocModeService } from './interface.js';

const DEFAULT_MODE = 'page';

@injectable()
export class DocModeServiceImpl implements DocModeService {
  private _modeMap = new Map<string, DocMode>();

  private _slotMap = new Map<string, Slot<DocMode>>();

  setMode = (mode: DocMode, docId: string) => {
    this._modeMap.set(docId, mode);
    this._slotMap.get(docId)?.emit(mode);
  };

  getMode = (docId: string) => {
    return this._modeMap.get(docId) ?? DEFAULT_MODE;
  };

  toggleMode = (docId: string) => {
    const mode = this.getMode(docId) === 'page' ? 'edgeless' : 'page';
    this.setMode(mode, docId);
    return mode;
  };

  onModeChange = (handler: (mode: DocMode) => void, docId: string) => {
    if (!this._slotMap.get(docId)) {
      this._slotMap.set(docId, new Slot());
    }
    return this._slotMap.get(docId)!.on(handler);
  };
}
