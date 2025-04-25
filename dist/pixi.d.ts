declare function distanceToPoint(a: Point, b: Point): number;
declare function subtractPoint(a: Point, b: Point): Point;
declare function addToPoint({ x, y }: Point, value: number): Point;
declare function calculateMidPoint(a: Point, b: Point): Point;
export { addToPoint, calculateMidPoint, distanceToPoint, subtractPoint };
