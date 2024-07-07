import type { DocMode, DocModeService } from '@blocksuite/blocks';
import { Slot } from '@blocksuite/global/utils';
import { injectable } from 'inversify';

const DEFAULT_MODE = 'page';

function getModeFromStorage() {
  const mapJson = localStorage.getItem('playground:docMode');
  const mapArray = mapJson ? JSON.parse(mapJson) : [];
  return new Map<string, DocMode>(mapArray);
}

function saveModeToStorage(map: Map<string, DocMode>) {
  const mapArray = Array.from(map);
  const mapJson = JSON.stringify(mapArray);
  localStorage.setItem('playground:docMode', mapJson);
}

export function removeModeFromStorage(docId: string) {
  const modeMap = getModeFromStorage();
  modeMap.delete(docId);
  saveModeToStorage(modeMap);
}

@injectable()
export class LocalDocModeServiceImpl implements DocModeService {
  private _slotMap = new Map<string, Slot<DocMode>>();

  setMode = (mode: DocMode, docId: string) => {
    const modeMap = getModeFromStorage();
    modeMap.set(docId, mode);
    saveModeToStorage(modeMap);
    this._slotMap.get(docId)?.emit(mode);
  };

  getMode = (docId: string) => {
    try {
      const modeMap = getModeFromStorage();
      return modeMap.get(docId) ?? DEFAULT_MODE;
    } catch (_e) {
      return DEFAULT_MODE;
    }
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
