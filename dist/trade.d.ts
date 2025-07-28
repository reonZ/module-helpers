import { ActionCost, ActorPF2e, PhysicalItemPF2e, PhysicalItemSource } from "foundry-pf2e";
declare function getTradeData(item: PhysicalItemPF2e, quantity?: number): TradeData | undefined;
declare function updateTradedItemSource(item: PhysicalItemPF2e<ActorPF2e>, { contentSources, allowedQuantity, giveQuantity }: TradeData): Promise<void>;
declare function giveItemToActor(itemOrUuid: PhysicalItemPF2e | EmbeddedItemUUID, targetOrUuid: ActorPF2e | ActorUUID, quantity?: number, newStack?: boolean): Promise<GiveItemData | undefined>;
declare function createTradeMessage({ cost, item, message, quantity, source, subtitle, target, userId, }: TradeMessageOptions): Promise<import("foundry-pf2e/pf2e/module/chat-message/document.js").ChatMessagePF2e | undefined>;
declare function updateItemTransferDialog(html: HTMLElement, { button, prompt, title, noStack }: UpdateItemTransferDialogOptions): void;
type UpdateItemTransferDialogOptions = {
    title: string;
    button?: string;
    prompt: string;
    noStack?: boolean;
};
type TradeMessageOptions = {
    /** localization key */
    cost?: string | number | null | ActionCost;
    item: PhysicalItemPF2e;
    message: string;
    quantity?: number;
    source: ActorPF2e;
    subtitle: string;
    target?: ActorPF2e;
    userId?: string;
};
type ContainerContentSource = PhysicalItemSource & {
    _id: string;
    _previousId: string;
};
type ActorTransferItemArgs = [
    targetActor: ActorPF2e,
    item: PhysicalItemPF2e<ActorPF2e>,
    quantity: number,
    containerId?: string,
    newStack?: boolean,
    isPurchase?: boolean | null
];
type TradeData = {
    allowedQuantity: number;
    contentSources: ContainerContentSource[];
    giveQuantity: number;
    isContainer: boolean;
    itemSource: PhysicalItemSource;
};
type GiveItemData = {
    item: PhysicalItemPF2e;
    giveQuantity: number;
    hasContent: boolean;
};
export { createTradeMessage, getTradeData, giveItemToActor, updateItemTransferDialog, updateTradedItemSource, };
export type { ActorTransferItemArgs, TradeMessageOptions };
