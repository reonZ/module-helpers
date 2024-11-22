function createChatLink(docOrUuid, { label, html } = {}) {
    const isDocument = docOrUuid instanceof foundry.abstract.Document;
    if (!label && isDocument) {
        label = docOrUuid.name ?? undefined;
    }
    let link = `@UUID[${isDocument ? docOrUuid.uuid : docOrUuid}]`;
    if (label) {
        link = `${link}{${label}}`;
    }
    return html ? TextEditor.enrichHTML(link) : link;
}
function* latestChatMessages(nb, fromMessage) {
    const chat = ui.chat?.element;
    if (!chat)
        return;
    const messages = game.messages.contents;
    const start = (fromMessage ? messages.findLastIndex((m) => m === fromMessage) : messages.length) - 1;
    for (let i = start; i >= start - nb; i--) {
        const message = messages[i];
        if (!message)
            return;
        const li = chat.find(`[data-message-id=${message.id}]`);
        if (!li.length)
            continue;
        yield { message, li };
    }
}
async function refreshLatestMessages(nb) {
    for (const { message, li } of latestChatMessages(nb)) {
        const html = await message.getHTML();
        li.replaceWith(html);
    }
}
export { createChatLink, latestChatMessages, refreshLatestMessages };
