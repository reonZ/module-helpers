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
export { addPoints, subtractPoints };
