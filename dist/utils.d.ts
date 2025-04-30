declare function joinStr(separator: "/" | "." | "-", ...path: any[]): string;
declare function arrayIncludes(arr: any[], test: any[]): boolean;
declare function roundToStep(value: number, step: number): number;
declare function isDecimal(num: number): boolean;
export { arrayIncludes, isDecimal, joinStr, roundToStep };
