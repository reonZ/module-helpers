import { TokenPF2e } from "foundry-pf2e";

function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e): Point {
    let position = token.getCenterPoint({ x: 0, y: 0 });

    position.x = x - position.x;
    position.y = y - position.y;
    position = token.getSnappedPosition(position);

    return position;
}

export { positionTokenFromCoords };
