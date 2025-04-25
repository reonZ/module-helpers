import * as R from "remeda";

function joinStr(separator: "/" | "." | "-", ...path: any[]): string {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}

function arrayIncludes(arr: any[], test: any[]): boolean {
    return test.some((entry) => arr.includes(entry));
}

function roundToStep(value: number, step: number): number {
    step = value < 0 ? step * -1 : step;
    const half = step / 2;
    return value + half - ((value + half) % step);
}

export { arrayIncludes, joinStr, roundToStep };
