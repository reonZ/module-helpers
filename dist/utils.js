import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter((x) => typeof x === "string"), R.join(separator));
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
export { arrayIncludes, beautifySlug, compareArrays, getUuidFromInlineMatch, joinStr, removeIndexFromArray, rollDie, stringBoolean, stringNumber, };
