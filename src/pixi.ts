function distanceBetweenPoints(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}

export { distanceBetweenPoints };
