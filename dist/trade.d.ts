import { ActorPF2e, PhysicalItemPF2e } from "foundry-pf2e";
declare function giveItemToActor(itemOrUuid: PhysicalItemPF2e | EmbeddedItemUUID, targetOrUuid: ActorPF2e | ActorUUID, quantity?: number, newStack?: boolean): Promise<PhysicalItemPF2e | undefined>;
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
