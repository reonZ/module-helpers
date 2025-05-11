import { ActorPF2e, ItemPF2e } from "foundry-pf2e";
declare function giveItemToActor(itemOrUuid: ItemPF2e | EmbeddedItemUUID, targetOrUuid: ActorPF2e | ActorUUID, quantity?: number, newStack?: boolean): Promise<import("foundry-pf2e/pf2e/module/item/physical/document.js").PhysicalItemPF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>> | undefined>;
export { giveItemToActor };
