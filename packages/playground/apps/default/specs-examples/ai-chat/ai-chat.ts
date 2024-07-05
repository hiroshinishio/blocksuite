import {
  EdgelessEditorBlockSpecs,
  PageEditorBlockSpecs,
} from '@blocksuite/blocks';
import { AIChatBlockSpec, EdgelessAIChatBlockSpec } from '@blocksuite/presets';

export function getAIChatSpecs() {
  const pageModeSpecs = [...PageEditorBlockSpecs, AIChatBlockSpec];
  const edgelessModeSpecs = [
    ...EdgelessEditorBlockSpecs,
    EdgelessAIChatBlockSpec,
  ];

  return {
    pageModeSpecs,
    edgelessModeSpecs,
  };
}
