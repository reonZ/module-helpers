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
function distanceBetweenPoints(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
export { addPoints, distanceBetweenPoints, subtractPoints };
