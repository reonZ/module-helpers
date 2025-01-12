declare function addPoints(a: Point, b: Point): {
    x: number;
    y: number;
};
declare function subtractPoints(a: Point, b: Point): {
    x: number;
    y: number;
};
declare function distanceBetweenPoints(a: Point, b: Point): number;
export { addPoints, distanceBetweenPoints, subtractPoints };
