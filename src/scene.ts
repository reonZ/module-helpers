import { TokenDocumentPF2e } from "foundry-pf2e";

function* scenesTokens({ skipLinked = false }: ScenesTokensOptions = {}) {
    for (const scene of game.scenes) {
        for (const token of scene.tokens) {
            if (!skipLinked || !token.actorLink) {
                yield token;
            }
        }
    }
}

function hasScenesTokenWith(
    condition: (token: TokenDocumentPF2e) => boolean,
    options?: ScenesTokensOptions
) {
    for (const token of scenesTokens(options)) {
        if (condition(token)) {
            return true;
        }
    }

    return false;
}

type ScenesTokensOptions = {
    skipLinked?: boolean;
};

export { hasScenesTokenWith, scenesTokens };
