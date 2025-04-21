function distanceToPoint(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
}
function subtractPoint(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}
export { distanceToPoint, subtractPoint };
