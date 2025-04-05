function addPoints(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

function subtractPoints(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

function calculateMidPoint(a: Point, b: Point): Point {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

function distanceBetweenPoints(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

function drawDebugLine(origin: Point, target: Point, color: "blue" | "red" | "green" = "green") {
    const hex = color === "blue" ? 0x0066cc : color === "red" ? 0xff0000 : 0x16a103;
    canvas.controls.debug.lineStyle(4, hex).moveTo(origin.x, origin.y).lineTo(target.x, target.y);
}

function clearDebug() {
    canvas.controls.debug.clear();
}

export {
    addPoints,
    calculateMidPoint,
    clearDebug,
    distanceBetweenPoints,
    drawDebugLine,
    subtractPoints,
};
