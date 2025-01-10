/// <reference types="jquery" />
import { AbilityItemPF2e, ActorPF2e, ConsumablePF2e, FeatPF2e, ItemInstances, ItemPF2e, ItemSourcePF2e, ItemType, PhysicalItemPF2e, WeaponPF2e } from "foundry-pf2e";
declare const ITEM_CARRY_TYPES: readonly ["attached", "dropped", "held", "stowed", "worn"];
declare const PHYSICAL_ITEM_TYPES: Set<"armor" | "book" | "consumable" | "backpack" | "equipment" | "shield" | "treasure" | "weapon">;
declare function detachSubitem(subitem: PhysicalItemPF2e, skipConfirm: boolean): Promise<void>;
declare function consumeItem(event: Event, item: ConsumablePF2e, thisMany?: number): Promise<void | ConsumablePF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null> | null> | null>;
declare function hasFreePropertySlot(item: WeaponPF2e): boolean;
/** Determine in a type-safe way whether an `ItemPF2e` or `ItemSourcePF2e` is among certain types */
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(item: ItemOrSource, ...types: TType[]): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
declare function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(item: ItemOrSource, ...types: TType[]): item is TType extends "physical" ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"] : TType extends ItemType ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"] : never;
declare function itemIsOfType<TParent extends ActorPF2e | null>(item: ItemOrSource, type: "physical"): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
declare function calculateItemPrice(item: PhysicalItemPF2e, quantity?: number, ratio?: number): import("foundry-pf2e/pf2e/module/item/physical/coins.js").CoinsPF2e;
declare function getActionImg(item: FeatPF2e | AbilityItemPF2e, itemImgFallback?: boolean): ImageFilePath;
declare function unownedItemtoMessage(actor: ActorPF2e, item: ItemPF2e, event?: Maybe<Event | JQuery.TriggeredEvent>, options?: {
    rollMode?: RollMode | "roll";
    create?: boolean;
    data?: Record<string, unknown>;
}): Promise<ChatMessage | undefined>;
/**
 * `traits` retrieved in the `getChatData` across the different items
 */
declare function getItemChatTraits(item: ItemPF2e<ActorPF2e>): import("foundry-pf2e/pf2e/module/item/base/data").TraitChatData[];
type ItemOrSource = PreCreate<ItemSourcePF2e> | ItemPF2e;
export { ITEM_CARRY_TYPES, PHYSICAL_ITEM_TYPES, calculateItemPrice, consumeItem, detachSubitem, getActionImg, getItemChatTraits, hasFreePropertySlot, itemIsOfType, unownedItemtoMessage, };
