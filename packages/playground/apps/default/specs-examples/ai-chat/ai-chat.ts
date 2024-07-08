import {
  EdgelessEditorBlockSpecs,
  PageEditorBlockSpecs,
} from '@blocksuite/blocks';
import { AIChatBlockSpec, EdgelessAIChatBlockSpec } from '@blocksuite/presets';

export function getAIChatSpecs() {
  const pageModeSpecs = [
    ...PageEditorBlockSpecs,
    AIChatBlockSpec,
    EdgelessAIChatBlockSpec,
  ];
  const edgelessModeSpecs = [
    ...EdgelessEditorBlockSpecs,
    AIChatBlockSpec,
    EdgelessAIChatBlockSpec,
  ];

  return {
    pageModeSpecs,
    edgelessModeSpecs,
  };
}
