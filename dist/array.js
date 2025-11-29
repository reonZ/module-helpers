import { R } from ".";
function arraysEqual(arr1, arr2) {
    arr1 = R.unique(arr1);
    arr2 = R.unique(arr2);
    return arr1.length === arr2.length && arr1.every((entry) => arr2.includes(entry));
}
function removeIndexFromArray(array, index, copy = true) {
    const usedArray = (copy ? array.slice() : array);
    if (index < 0 || index >= array.length) {
        return usedArray;
    }
    usedArray.splice(index, 1);
    return usedArray;
}
function includesAny(arr, entries) {
    for (const entry of entries) {
        if (arr.includes(entry)) {
            return true;
        }
    }
    return false;
}
function includesAll(arr, entries) {
    for (const entry of entries) {
        if (!arr.includes(entry)) {
            return false;
        }
    }
    return true;
}
export { arraysEqual, includesAll, includesAny, removeIndexFromArray };
