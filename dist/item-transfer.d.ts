import { ActionCost, ActorPF2e, PhysicalItemPF2e, PhysicalItemSource } from "foundry-pf2e";
declare function initiateTransfer({ item, targetActor, }: {
    item: PhysicalItemPF2e;
    targetActor?: ActorPF2e;
}): Promise<MoveLootFormData | null>;
declare function getTransferData({ item, quantity, withContent, }: {
    item: PhysicalItemPF2e;
    withContent?: boolean;
    quantity?: number;
}): Promise<{
    itemSources: PhysicalItemSource[];
    quantity: number;
} | null>;
declare function updateTransferSource({ item, withContent, quantity, }: {
    item: PhysicalItemPF2e;
    withContent?: boolean;
    quantity?: number;
}): Promise<boolean>;
declare function createTransferMessage({ sourceActor, targetActor, subtitle, message, quantity, userId, item, cost, }: {
    sourceActor: ActorPF2e;
    targetActor?: ActorPF2e;
    subtitle: string;
    message: string;
    item: {
        img: string;
        link?: string;
    };
    quantity?: number;
    cost?: TransferCost;
    userId?: string;
}): Promise<ChatMessage | undefined>;
interface MoveLootFormData {
    quantity: number;
    newStack: boolean;
}
type TransferCost = string | number | null | ActionCost;
export { createTransferMessage, getTransferData, initiateTransfer, updateTransferSource };
