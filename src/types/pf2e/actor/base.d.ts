import { ActorPF2e, PhysicalItemPF2e } from "foundry-pf2e";

export {};

declare global {
    interface ResetActorsRenderOptions {
        sheets?: boolean;
        tokens?: boolean;
    }

    type ActorTransferItemArgs = [
        targetActor: ActorPF2e,
        item: PhysicalItemPF2e<ActorPF2e>,
        quantity: number,
        containerId?: string,
        newStack?: boolean,
        isPurchase?: boolean | null
    ];
}
