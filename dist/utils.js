import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, //
    R.flat(), R.filter((x) => R.isString(x) && !!x), R.join(separator));
}
function splitStr(str, separator = ",") {
    return R.pipe(str, R.split(separator), R.filter(R.isString), R.map((x) => x.trim()));
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
function rollDie(faces, nb = 1) {
    let total = 0;
    for (let i = 0; i < nb; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}
function stringBoolean(b) {
    return String(b);
}
function stringNumber(b) {
    return String(b);
}
function localeCompare(a, b) {
    return a.localeCompare(b, game.i18n.lang);
}
function sortByLocaleCompare(list, key) {
    list.sort((a, b) => localeCompare(a[key], b[key]));
}
function waitTimeout(time = 1) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
function mapToObjByKey(arr, key) {
    return R.pipe(arr, R.map((entry) => {
        return [entry[key], entry];
    }), R.fromEntries());
}
function isIterable(obj) {
    return R.isObjectType(obj) && Symbol.iterator in obj && typeof obj[Symbol.iterator] === "function";
}
function recordToSelectOptions(record) {
    return R.pipe(record, R.entries(), R.map(([value, label]) => {
        return { value, label };
    }));
}
export { activateHooksAndWrappers, disableHooksAndWrappers, isDecimal, isIterable, joinStr, localeCompare, mapToObjByKey, recordToSelectOptions, rollDie, roundToStep, sortByLocaleCompare, splitStr, stringBoolean, stringNumber, toggleHooksAndWrappers, waitTimeout, };
