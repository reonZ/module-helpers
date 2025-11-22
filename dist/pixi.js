function distanceToPoint(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
function subtractPoint(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}
function multiplyPointBy(point, value) {
    return {
        x: point.x * value,
        y: point.y * value,
    };
}
function dividePointBy(point, value) {
    return {
        x: point.x / value,
        y: point.y / value,
    };
}
function addToPoint({ x, y }, value) {
    return {
        x: x + value,
        y: y + value,
    };
}
function calculateMidPoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}
function drawRectangleMask(x, y, width, height, radius) {
    const mask = new PIXI.Graphics();
    mask.beginFill(0x555555);
    if (radius) {
        mask.drawRoundedRect(x, y, width, height, radius);
    }
    else {
        mask.drawRect(x, y, width, height);
    }
    mask.endFill();
    return mask;
}
function drawCircleMask(x, y, radius) {
    const mask = new PIXI.Graphics();
    mask.beginFill(0x555555);
    mask.drawCircle(x, y, radius);
    mask.endFill();
    return mask;
}
export { addToPoint, calculateMidPoint, distanceToPoint, dividePointBy, drawCircleMask, drawRectangleMask, multiplyPointBy, subtractPoint, };
