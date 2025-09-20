import { ActorPF2e, PhysicalItemPF2e, PhysicalItemSource } from "foundry-pf2e";
declare function getTradeData(item: PhysicalItemPF2e, quantity?: number): TradeData | undefined;
declare function updateTradedItemSource(item: PhysicalItemPF2e<ActorPF2e>, { contentSources, allowedQuantity, giveQuantity }: TradeData): Promise<void>;
declare function giveItemToActor(itemOrUuid: PhysicalItemPF2e | EmbeddedItemUUID, targetOrUuid: ActorPF2e | ActorUUID, quantity?: number, newStack?: boolean): Promise<GiveItemData | undefined>;
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
export { getTradeData, giveItemToActor, updateTradedItemSource };
export type { ActorTransferItemArgs };
