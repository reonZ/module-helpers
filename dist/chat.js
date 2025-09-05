function* latestChatMessages(nb, fromMessage) {
    if (!ui.chat)
        return;
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
async function refreshLatestMessages(nb) {
    const chat = ui.chat?.element;
    if (!chat)
        return;
    const messages = game.messages.contents;
    const startIndex = messages.length - 1;
    for (let i = startIndex; i >= startIndex - nb; i--) {
        const message = messages[i];
        if (message) {
            ui.chat.updateMessage(message, { notify: false });
        }
    }
}
function isActionMessage(message) {
    const type = message.getFlag("pf2e", "origin.type");
    return !!type && ["feat", "action"].includes(type);
}
function isSpellMessage(message) {
    return typeof message.getFlag("pf2e", "casting.id") === "string";
}
function createChatLink(docOrUuid, { label, html } = {}) {
    const isDocument = docOrUuid instanceof foundry.abstract.Document;
    if (!label && isDocument) {
        label = docOrUuid.name ?? undefined;
    }
    let link = `@UUID[${isDocument ? docOrUuid.uuid : docOrUuid}]`;
    if (label) {
        link = `${link}{${label}}`;
    }
    return html ? foundry.applications.ux.TextEditor.implementation.enrichHTML(link) : link;
}
export { createChatLink, isActionMessage, isSpellMessage, latestChatMessages, refreshLatestMessages, };
