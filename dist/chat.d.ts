import { ChatContextFlag, ChatMessagePF2e } from "foundry-pf2e";
declare function latestChatMessages(nb: number, fromMessage?: ChatMessagePF2e): Generator<ChatMessagePF2e, void, undefined>;
declare function refreshLatestMessages(nb: number): Promise<void>;
declare function isActionMessage(message: ChatMessagePF2e): boolean;
declare function isSpellMessage(message: ChatMessagePF2e): boolean;
declare function createChatLink(docOrUuid: ClientDocument | string, options?: {
    label?: string;
    html: true;
}): Promise<string>;
declare function createChatLink(docOrUuid: ClientDocument | string, options: {
    label?: string;
    html?: false;
}): string;
declare function getMessageContext<T extends ChatContextFlag | undefined>(message: ChatMessagePF2e): T;
export { createChatLink, getMessageContext, isActionMessage, isSpellMessage, latestChatMessages, refreshLatestMessages, };
