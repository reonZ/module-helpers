import { TokenPF2e } from "foundry-pf2e";

function selectTokens(tokens: TokenPF2e[]) {
    canvas.tokens.releaseAll();

    for (const token of tokens) {
        token.control({ releaseOthers: false });
    }
}

function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e, snapped = true): Point {
    let position = token.getCenterPoint({ x: 0, y: 0 });

    position.x = x - position.x;
    position.y = y - position.y;

    if (snapped) {
        position = token.getSnappedPosition(position);
    }

    return position;
}

export { positionTokenFromCoords, selectTokens };
