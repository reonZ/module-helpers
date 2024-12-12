function* scenesTokens({ skipLinked = false } = {}) {
    for (const scene of game.scenes) {
        for (const token of scene.tokens) {
            if (!skipLinked || !token.actorLink) {
                yield token;
            }
        }
    }
}
function hasScenesTokenWith(condition, options) {
    for (const token of scenesTokens(options)) {
        if (condition(token)) {
            return true;
        }
    }
    return false;
}
export { hasScenesTokenWith, scenesTokens };
