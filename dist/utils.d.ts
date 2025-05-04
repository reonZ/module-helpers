declare function joinStr(separator: StringSeparator, ...path: any[]): string;
declare function splitStr(str: string, separator?: StringSeparator): string[];
declare function arrayIncludes(arr: any[], test: any[]): boolean;
declare function roundToStep(value: number, step: number): number;
declare function isDecimal(num: number): boolean;
type StringSeparator = "/" | "." | "-" | ",";
export { arrayIncludes, isDecimal, joinStr, roundToStep, splitStr };
