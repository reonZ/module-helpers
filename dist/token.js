function positionTokenFromCoords({ x, y }, token) {
    let position = token.getCenterPoint({ x: 0, y: 0 });
    position.x = x - position.x;
    position.y = y - position.y;
    position = token.getSnappedPosition(position);
    return position;
}
export { positionTokenFromCoords };
