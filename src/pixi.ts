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

export { addPoints, subtractPoints };
