import * as R from "remeda";

function joinStr(separator: "/" | "." | "-", ...path: any[]): string {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}

function objectHasKey<T extends object>(obj: T, key: unknown): key is keyof T {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}

export { joinStr, objectHasKey };
