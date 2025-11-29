import { R } from ".";

function arraysEqual<T extends any[]>(arr1: T, arr2: any[]): arr2 is T {
    arr1 = R.unique(arr1) as unknown as T;
    arr2 = R.unique(arr2);
    return arr1.length === arr2.length && arr1.every((entry) => arr2.includes(entry));
}

function removeIndexFromArray<T extends any[]>(array: T, index: number, copy = true): T {
    const usedArray = (copy ? array.slice() : array) as T;

    if (index < 0 || index >= array.length) {
        return usedArray;
    }

    usedArray.splice(index, 1);
    return usedArray;
}

function includesAny(arr: any[], entries: any[]): boolean {
    for (const entry of entries) {
        if (arr.includes(entry)) {
            return true;
        }
    }

    return false;
}

function includesAll(arr: any[], entries: any[]): boolean {
    for (const entry of entries) {
        if (!arr.includes(entry)) {
            return false;
        }
    }

    return true;
}

export { arraysEqual, includesAll, includesAny, removeIndexFromArray };
