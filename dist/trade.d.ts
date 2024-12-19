import { ActionCost, ActorPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { ExtractSocketOptions } from ".";
declare function giveItemToActor({ item, origin, target, quantity, message }: TradeData, userId: string): Promise<PhysicalItemPF2e<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>> | null>;
declare function createTradeMessage({ item, message, origin, quantity, subtitle, target, userId, cost, imgPath, }: {
    origin: ActorPF2e;
    target?: ActorPF2e;
    quantity: number;
    subtitle: string;
    message: string;
    userId?: string;
    cost?: string | number | null | ActionCost;
    imgPath?: string;
    item?: PhysicalItemPF2e;
}): Promise<ChatMessage | undefined>;
type TradeData = {
    origin: ActorPF2e;
    target: ActorPF2e;
    item: PhysicalItemPF2e<ActorPF2e>;
    quantity: number | undefined;
    message?: {
        subtitle: string;
        message: string;
    };
};
type TradePacket<TType extends string, TData extends TradeData = TradeData> = ExtractSocketOptions<TData> & {
    type: TType;
};
export { createTradeMessage, giveItemToActor };
export type { TradeData, TradePacket };
