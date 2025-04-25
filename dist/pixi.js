function distanceToPoint(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
function subtractPoint(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
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
export { addToPoint, calculateMidPoint, distanceToPoint, subtractPoint };
