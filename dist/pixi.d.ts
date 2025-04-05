declare function addPoints(a: Point, b: Point): Point;
declare function subtractPoints(a: Point, b: Point): Point;
declare function calculateMidPoint(a: Point, b: Point): Point;
declare function distanceBetweenPoints(a: Point, b: Point): number;
declare function drawDebugLine(origin: Point, target: Point, color?: "blue" | "red" | "green"): void;
declare function clearDebug(): void;
export { addPoints, calculateMidPoint, clearDebug, distanceBetweenPoints, drawDebugLine, subtractPoints, };
