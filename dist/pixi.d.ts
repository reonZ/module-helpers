declare function distanceToPoint(a: Point, b: Point): number;
declare function subtractPoint(a: Point, b: Point): Point;
declare function multiplyPointBy(point: Point, value: number): Point;
declare function dividePointBy(point: Point, value: number): Point;
declare function addToPoint({ x, y }: Point, value: number): Point;
declare function calculateMidPoint(a: Point, b: Point): Point;
declare function drawRectangleMask(x: number, y: number, width: number, height: number, radius?: number): PIXI.Graphics;
declare function drawCircleMask(x: number, y: number, radius: number): PIXI.Graphics;
export { addToPoint, calculateMidPoint, distanceToPoint, dividePointBy, drawCircleMask, drawRectangleMask, multiplyPointBy, subtractPoint, };
