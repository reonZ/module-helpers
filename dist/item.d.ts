import { ActorPF2e, ItemInstances, ItemPF2e, ItemType } from "foundry-pf2e";
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function getItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType): ItemInstances<TActor>[TType] | null;
declare function getItemFromUuid(uuid: string): Promise<ItemPF2e | undefined>;
export { actorItems, getItemFromUuid, getItemWithSourceId };
