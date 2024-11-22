import { isInstanceOf } from "../object";
function resolveMacroActor(uuid) {
    if (uuid) {
        const actor = fromUuidSync(uuid);
        return isInstanceOf(actor, "ActorPF2e") ? actor : null;
    }
    const speaker = ChatMessage.getSpeaker();
    return (canvas.tokens.get(speaker.token ?? "")?.actor ??
        game.actors.get(speaker.actor ?? "") ??
        null);
}
export { resolveMacroActor };
