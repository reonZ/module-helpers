function selectTokens(tokens) {
    canvas.tokens.releaseAll();
    for (const token of tokens) {
        token.control({ releaseOthers: false });
    }
}
function positionTokenFromCoords({ x, y }, token, snapped = true) {
    let position = token.getCenterPoint({ x: 0, y: 0 });
    position.x = x - position.x;
    position.y = y - position.y;
    if (snapped) {
        position = token.getSnappedPosition(position);
    }
    return position;
}
export { positionTokenFromCoords, selectTokens };
