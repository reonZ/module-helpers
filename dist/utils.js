import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, //
    R.flat(), R.filter(R.isString), R.join(separator));
}
function arraysEqual(arr1, arr2) {
    arr1 = R.unique(arr1);
    arr2 = R.unique(arr2);
    return arr1.length === arr2.length && arr1.every((entry) => arr2.includes(entry));
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
function removeIndexFromArray(array, index, copy = true) {
    const usedArray = (copy ? array.slice() : array);
    if (index < 0 || index >= array.length)
        return usedArray;
    usedArray.splice(index, 1);
    return usedArray;
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
export { activateHooksAndWrappers, arraysEqual, disableHooksAndWrappers, isDecimal, joinStr, localeCompare, removeIndexFromArray, rollDie, roundToStep, sortByLocaleCompare, stringBoolean, stringNumber, toggleHooksAndWrappers, };
