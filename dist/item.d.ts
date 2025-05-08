import { ActorPF2e, ItemInstances, ItemPF2e, ItemSourcePF2e, ItemType } from "foundry-pf2e";
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function findItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType): ItemInstances<TActor>[TType] | null;
declare function getItemFromUuid(uuid: string): Promise<ItemPF2e | null>;
declare function getItemSource<T extends ItemPF2e>(item: T, clearId?: boolean): T["_source"];
declare function getItemSourceFromUuid(uuid: string): Promise<ItemSourcePF2e | null>;
declare function getItemSourceId(item: ItemPF2e): string;
export { actorItems, findItemWithSourceId, getItemFromUuid, getItemSource, getItemSourceFromUuid, getItemSourceId, };
