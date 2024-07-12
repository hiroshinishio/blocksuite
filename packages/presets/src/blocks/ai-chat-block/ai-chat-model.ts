import { selectable, type SerializedXYWH } from '@blocksuite/block-std';
import { BlockModel, defineBlockSchema } from '@blocksuite/store';

type AIChatProps = {
  xywh: SerializedXYWH;
  index: string;
  messages: string; // JSON string of ChatMessage[]
  sessionId: string;
};

export const AIChatBlockSchema = defineBlockSchema({
  flavour: 'affine:ai-chat',
  props: (): AIChatProps => ({
    xywh: '[0,0,0,0]',
    index: 'a0',
    messages: '',
    sessionId: '',
  }),
  metadata: {
    version: 1,
    role: 'content',
    parent: ['affine:surface'],
    children: [],
  },
  toModel: () => {
    return new AIChatBlockModel();
  },
});

export class AIChatBlockModel extends selectable<AIChatProps>(BlockModel) {}
