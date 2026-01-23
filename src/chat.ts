import { ChatContextFlag, ChatMessagePF2e } from "foundry-pf2e";
import { SYSTEM, enrichHTML } from ".";

function* latestChatMessages(nb: number, fromMessage?: ChatMessagePF2e): Generator<ChatMessagePF2e, void, undefined> {
    if (!ui.chat) return;

    const messages = game.messages.contents;
    const startMessageIndex = fromMessage
        ? messages.findLastIndex((message) => message === fromMessage)
        : messages.length;

    const startIndex = startMessageIndex - 1;

    for (let i = startIndex; i >= startIndex - nb; i--) {
        const message = messages[i];
        if (message) {
            yield message;
        }
    }
}

async function refreshLatestMessages(nb: number) {
    const chat = ui.chat?.element;
    if (!chat) return;

    const messages = game.messages.contents;
    const startIndex = messages.length - 1;

    for (let i = startIndex; i >= startIndex - nb; i--) {
        const message = messages[i];
        if (message) {
            ui.chat.updateMessage(message, { notify: false });
        }
    }
}

function isActionMessage(message: ChatMessagePF2e): boolean {
    const type = SYSTEM.getFlag(message, "origin.type") as string | undefined;
    return !!type && ["feat", "action"].includes(type);
}

function isSpellMessage(message: ChatMessagePF2e): boolean {
    return typeof SYSTEM.getFlag(message, "casting.id") === "string";
}

function createChatLink(docOrUuid: ClientDocument | string, options?: { label?: string; html: true }): Promise<string>;
function createChatLink(docOrUuid: ClientDocument | string, options: { label?: string; html?: false }): string;
function createChatLink(
    docOrUuid: ClientDocument | string,
    { label, html }: { label?: string; html?: boolean } = {},
): Promisable<string> {
    const isDocument = docOrUuid instanceof foundry.abstract.Document;

    if (!label && isDocument) {
        label = docOrUuid.name ?? undefined;
    }

    let link = `@UUID[${isDocument ? docOrUuid.uuid : docOrUuid}]`;

    if (label) {
        link = `${link}{${label}}`;
    }

    return html ? enrichHTML(link) : link;
}

function getMessageContext<T extends ChatContextFlag | undefined>(message: ChatMessagePF2e): T {
    return message.getFlag(SYSTEM.id, "context") as T;
}

export {
    createChatLink,
    getMessageContext,
    isActionMessage,
    isSpellMessage,
    latestChatMessages,
    refreshLatestMessages,
};
