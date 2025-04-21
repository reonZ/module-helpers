function distanceToPoint(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

function subtractPoint(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

export { distanceToPoint, subtractPoint };
