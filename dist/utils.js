import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}
function stringBoolean(b) {
    return String(b);
}
function stringNumber(n) {
    return String(n);
}
function beautifySlug(slug) {
    return game.pf2e.system
        .sluggify(slug, { camel: "bactrian" })
        .replace(/([a-z])([A-Z])/g, "$1 $2");
}
function compareArrays(arr1, arr2, unique = false) {
    arr1 = unique ? R.filter(arr1, R.isTruthy) : arr1;
    arr2 = unique ? R.filter(arr2, R.isTruthy) : arr2.slice();
    if (arr1.length !== arr2.length)
        return false;
    for (const value1 of arr1) {
        const index = arr2.findIndex((value2) => value1 === value2);
        if (index === -1)
            return false;
        arr2.splice(index, 1);
    }
    return true;
}
function arrayIncludes(array, other) {
    return other.some((value) => array.includes(value));
}
function getUuidFromInlineMatch(match) {
    return match[1] === "Compendium" ? `Compendium.${match[2]}` : match[2];
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
function indexObjToArray(obj) {
    if (!obj)
        return [];
    if (R.isArray(obj))
        return obj;
    return R.pipe(R.entries(obj), R.sortBy(([k]) => Number(k)), R.map(([k, v]) => v));
}
function roundToStep(value, step) {
    step = value < 0 ? step * -1 : step;
    const half = step / 2;
    return value + half - ((value + half) % step);
}
function nextPowerOf2(value) {
    let count = 0;
    if ((value & (value - 1)) === 0) {
        return value;
    }
    while (value > 0) {
        value >>= 1;
        count++;
    }
    return 1 << count;
}
function setHasAny(set, ...entries) {
    for (const entry of entries) {
        if (set.has(entry))
            return true;
    }
    return false;
}
export { arrayIncludes, beautifySlug, compareArrays, getUuidFromInlineMatch, indexObjToArray, joinStr, nextPowerOf2, removeIndexFromArray, rollDie, roundToStep, setHasAny, stringBoolean, stringNumber, };
