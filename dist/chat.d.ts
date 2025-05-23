import { ChatMessagePF2e } from "foundry-pf2e";
declare function latestChatMessages(nb: number, fromMessage?: ChatMessagePF2e): Generator<ChatMessagePF2e, void, undefined>;
declare function refreshLatestMessages(nb: number): Promise<void>;
export { latestChatMessages, refreshLatestMessages };
