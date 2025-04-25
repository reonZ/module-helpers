function distanceToPoint(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

function subtractPoint(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

function addToPoint({ x, y }: Point, value: number): Point {
    return {
        x: x + value,
        y: y + value,
    };
}

function calculateMidPoint(a: Point, b: Point): Point {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

export { addToPoint, calculateMidPoint, distanceToPoint, subtractPoint };
