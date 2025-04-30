import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}
function arrayIncludes(arr, test) {
    return test.some((entry) => arr.includes(entry));
}
function roundToStep(value, step) {
    step = value < 0 ? step * -1 : step;
    const half = step / 2;
    return value + half - ((value + half) % step);
}
function isDecimal(num) {
    return num % 1 !== 0;
}
export { arrayIncludes, isDecimal, joinStr, roundToStep };
