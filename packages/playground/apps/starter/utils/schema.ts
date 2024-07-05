import type { BlockSchemaType } from '@blocksuite/store';

export function patchSchemaChildren(
  childSchema: BlockSchemaType,
  parentSchema: BlockSchemaType
) {
  const childFlavour = childSchema.model.flavour;
  parentSchema.model.children?.push(childFlavour);
}
