import { ActionCost, ActorPF2e, PhysicalItemPF2e, PhysicalItemSource } from "foundry-pf2e";
declare function initiateTransfer({ item, targetActor, prompt, title, }: {
    item: PhysicalItemPF2e;
    targetActor?: ActorPF2e;
    title?: string;
    prompt?: string;
}): Promise<MoveLootFormData | null>;
declare function getTransferData({ item, quantity, withContent, }: {
    item: PhysicalItemPF2e;
    withContent?: boolean;
    quantity?: number;
}): Promise<{
    itemSource: PhysicalItemSource;
    contentSources: PhysicalItemSource[];
    quantity: number;
} | null>;
declare function addItemsToActor({ targetActor, itemSource, contentSources, newStack, }: {
    targetActor: ActorPF2e;
    itemSource: PhysicalItemSource;
    contentSources: PhysicalItemSource[];
    newStack?: boolean;
}): Promise<{
    item: import("foundry-pf2e/pf2e/module/item/base/document.js").ItemPF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>>;
    contentItems: import("foundry-pf2e/pf2e/module/item/base/document.js").ItemPF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>>[];
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
declare function getRealQuantity(item: PhysicalItemPF2e, quantity?: number): number;
interface MoveLootFormData {
    quantity: number;
    newStack: boolean;
}
type TransferCost = string | number | null | ActionCost;
export { addItemsToActor, createTransferMessage, getRealQuantity, getTransferData, initiateTransfer, updateTransferSource, };
export type { MoveLootFormData };
