import { ActorPF2e, CharacterPF2e, ChatMessagePF2e, ConsumablePF2e, CreaturePF2e, EquipmentPF2e, ItemInstances, ItemPF2e, ItemSourcePF2e, ItemType, PhysicalItemPF2e, ZeroToTwo } from "foundry-pf2e";
import { IsInstanceOfItem, IsInstanceOfItems } from ".";
declare const ITEM_CARRY_TYPES: readonly ["attached", "dropped", "held", "stowed", "worn"];
declare function actorItems<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, type?: TType | TType[]): Generator<ItemInstances<TActor>[TType]>;
declare function isSupressedFeat<TActor extends ActorPF2e | null>(item: ItemPF2e<TActor>): boolean;
declare function findItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(actor: TActor, uuid: string, type?: TType): ItemInstances<TActor>[TType] | null;
declare function hasItemWithSourceId(actor: ActorPF2e, uuid: string, type?: ItemType): boolean;
declare function hasAnyItemWithSourceId(actor: ActorPF2e, uuids: string[], type?: ItemType): boolean;
declare function getItemFromUuid<T extends IsInstanceOfItem>(uuid: Maybe<string>, instance?: T): Promise<IsInstanceOfItems[T] | null>;
declare function getItemFromUuid(uuid: Maybe<string>, instance?: string): Promise<ItemPF2e | null>;
declare function getItemSource<T extends ItemPF2e>(item: T, clearId?: boolean): T["_source"];
declare function getItemSourceFromUuid<T extends IsInstanceOfItem>(uuid: string, instance?: T): Promise<IsInstanceOfItems[T]["_source"] | null>;
declare function getItemSourceFromUuid(uuid: string, instance?: string): Promise<ItemSourcePF2e | null>;
declare function getItemSourceId(item: ItemPF2e): ItemUUID;
/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/helpers.ts#L13
 */
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(item: ItemOrSource, ...types: TType[]): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(item: ItemOrSource, ...types: TType[]): item is TType extends "physical" ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"] : TType extends ItemType ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"] : never;
declare function itemIsOfType<TParent extends ActorPF2e | null>(item: ItemOrSource, type: "physical"): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
declare function isCastConsumable(item: ConsumablePF2e): boolean;
declare function usePhysicalItem(event: Event, item: EquipmentPF2e<ActorPF2e> | ConsumablePF2e<ActorPF2e>): Promise<unknown>;
/**
 * slightly modified version of
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/item/base/document.ts#L218
 */
declare function unownedItemToMessage(actor: ActorPF2e, item: ItemPF2e, event?: Maybe<Event>, options?: {
    rollMode?: RollMode | "roll";
    create?: boolean;
    data?: Record<string, unknown>;
}): Promise<ChatMessagePF2e | undefined>;
declare function getItemTypeLabel(type: ItemType): string;
declare function getEquipAnnotation(item: Maybe<PhysicalItemPF2e>): EquipAnnotationData | undefined;
/**
 * repurposed version of
 * https://github.com/foundryvtt/pf2e/blob/6ff777170c93618f234929c6d483a98a37cbe363/src/module/actor/character/helpers.ts#L210
 */
declare function equipItemToUse(actor: CharacterPF2e, item: PhysicalItemPF2e<CreaturePF2e>, { carryType, handsHeld, fullAnnotation, cost, }: Pick<EquipAnnotationData, "carryType" | "handsHeld" | "fullAnnotation" | "cost">): Promise<void>;
type EquipAnnotationData = {
    annotation: AuxiliaryAnnotation;
    cost: 1 | 2;
    fullAnnotation: string;
    handsHeld: ZeroToTwo;
    label: string;
    carryType: "held" | "worn";
};
type AuxiliaryAnnotation = "draw" | "pick-up" | "retrieve" | "sheathe";
type ItemOrSource = PreCreate<ItemSourcePF2e> | CompendiumIndexData | ItemPF2e;
export { actorItems, equipItemToUse, findItemWithSourceId, getEquipAnnotation, getItemFromUuid, getItemSource, getItemSourceFromUuid, getItemSourceId, getItemTypeLabel, hasAnyItemWithSourceId, hasItemWithSourceId, isCastConsumable, isSupressedFeat, ITEM_CARRY_TYPES, itemIsOfType, unownedItemToMessage, usePhysicalItem, };
export type { EquipAnnotationData };
