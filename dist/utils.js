import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, //
    R.flat(), R.filter(R.isString), R.join(separator));
}
function splitStr(str, separator = ",") {
    return R.pipe(str, R.split(separator), R.map((x) => x.trim()), R.filter(R.isTruthy));
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
function activateHooksAndWrappers(entries) {
    for (const entry of entries) {
        entry.activate();
    }
}
function disableHooksAndWrappers(entries) {
    for (const entry of entries) {
        entry.disable();
    }
}
function toggleHooksAndWrappers(entries, enabled) {
    for (const entry of entries) {
        entry.toggle(enabled);
    }
}
export { activateHooksAndWrappers, arrayIncludes, disableHooksAndWrappers, isDecimal, joinStr, roundToStep, splitStr, toggleHooksAndWrappers, };
