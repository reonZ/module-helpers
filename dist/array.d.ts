declare function arraysEqual<T extends any[]>(arr1: T, arr2: any[]): arr2 is T;
declare function removeIndexFromArray<T extends any[]>(array: T, index: number, copy?: boolean): T;
declare function includesAny(arr: any[], entries: any[]): boolean;
export { arraysEqual, includesAny, removeIndexFromArray };
