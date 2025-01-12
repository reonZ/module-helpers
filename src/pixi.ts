function addPoints(a: Point, b: Point) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

function subtractPoints(a: Point, b: Point) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

function distanceBetweenPoints(a: Point, b: Point) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

export { addPoints, distanceBetweenPoints, subtractPoints };
