function selectTokens(tokens) {
    canvas.tokens.releaseAll();
    for (const token of tokens) {
        token.control({ releaseOthers: false });
    }
}
export { selectTokens };
