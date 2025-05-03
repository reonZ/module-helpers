import { ActorPF2e, ItemInstances, ItemType } from "foundry-pf2e";
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function getItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType): ItemInstances<TActor>[TType] | null;
export { actorItems, getItemWithSourceId };
