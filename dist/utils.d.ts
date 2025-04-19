declare function joinStr(separator: "/" | "." | "-", ...path: any[]): string;
declare function objectHasKey<T extends object>(obj: T, key: unknown): key is keyof T;
export { joinStr, objectHasKey };
