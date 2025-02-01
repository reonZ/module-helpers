function addPoints(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}
function subtractPoints(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}
function calculateMidPoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}
function distanceBetweenPoints(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
export { addPoints, distanceBetweenPoints, calculateMidPoint, subtractPoints };
