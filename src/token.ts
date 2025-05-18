import { TokenPF2e } from "foundry-pf2e";

function selectTokens(tokens: TokenPF2e[]) {
    canvas.tokens.releaseAll();

    for (const token of tokens) {
        token.control({ releaseOthers: false });
    }
}

export { selectTokens };
