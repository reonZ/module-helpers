import { ActorPF2e, ConsumablePF2e, EquipmentPF2e, FeatPF2e, ItemInstances, ItemPF2e, ItemSourcePF2e, ItemType, PhysicalItemPF2e } from "foundry-pf2e";
import { IsInstanceOfItem, IsInstanceOfItems } from ".";
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function isSupressedFeat<TActor extends ActorPF2e | null>(item: ItemPF2e<TActor>): item is FeatPF2e<TActor>;
declare function findItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType): ItemInstances<TActor>[TType] | null;
declare function hasItemWithSourceId(actor: ActorPF2e, uuid: string, type?: ItemType): boolean;
declare function getItemFromUuid<T extends IsInstanceOfItem>(uuid: Maybe<string>, instance?: T): Promise<IsInstanceOfItems[T] | null>;
declare function getItemFromUuid(uuid: Maybe<string>, instance?: string): Promise<ItemPF2e | null>;
declare function getItemSource<T extends ItemPF2e>(item: T, clearId?: boolean): T["_source"];
declare function getItemSourceFromUuid<T extends IsInstanceOfItem>(uuid: string, instance?: T): Promise<IsInstanceOfItems[T]["_source"] | null>;
declare function getItemSourceFromUuid(uuid: string, instance?: string): Promise<ItemSourcePF2e | null>;
declare function getItemSourceId(item: ItemPF2e): string;
/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/helpers.ts#L13
 */
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(item: ItemOrSource, ...types: TType[]): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(item: ItemOrSource, ...types: TType[]): item is TType extends "physical" ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"] : TType extends ItemType ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"] : never;
declare function itemIsOfType<TParent extends ActorPF2e | null>(item: ItemOrSource, type: "physical"): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
declare function isCastConsumable(item: ConsumablePF2e): boolean;
declare function usePhysicalItem(event: Event, item: EquipmentPF2e<ActorPF2e> | ConsumablePF2e<ActorPF2e>): Promise<unknown>;
declare function getItemTypeLabel(type: ItemType): string;
type ItemOrSource = PreCreate<ItemSourcePF2e> | CompendiumIndexData | ItemPF2e;
export { actorItems, findItemWithSourceId, getItemFromUuid, getItemSource, getItemSourceFromUuid, getItemSourceId, getItemTypeLabel, hasItemWithSourceId, isCastConsumable, isSupressedFeat, itemIsOfType, usePhysicalItem, };
