import { ChatMessagePF2e } from "foundry-pf2e";

function* latestChatMessages(
    nb: number,
    fromMessage?: ChatMessagePF2e
): Generator<ChatMessagePF2e, void, undefined> {
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

export { latestChatMessages, refreshLatestMessages };
