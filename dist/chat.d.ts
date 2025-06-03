import { ChatMessagePF2e } from "foundry-pf2e";
declare function latestChatMessages(nb: number, fromMessage?: ChatMessagePF2e): Generator<ChatMessagePF2e, void, undefined>;
declare function refreshLatestMessages(nb: number): Promise<void>;
declare function isSpellMessage(message: ChatMessagePF2e): boolean;
export { isSpellMessage, latestChatMessages, refreshLatestMessages };
