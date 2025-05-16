import { ActorPF2e, ItemPF2e, PhysicalItemPF2e } from "foundry-pf2e";
declare function giveItemToActor(itemOrUuid: ItemPF2e | EmbeddedItemUUID, targetOrUuid: ActorPF2e | ActorUUID, quantity?: number, newStack?: boolean): Promise<PhysicalItemPF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>> | undefined>;
type ActorTransferItemArgs = [
    targetActor: ActorPF2e,
    item: PhysicalItemPF2e<ActorPF2e>,
    quantity: number,
    containerId?: string,
    newStack?: boolean,
    isPurchase?: boolean | null
];
export { giveItemToActor };
export type { ActorTransferItemArgs };
