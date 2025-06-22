import * as R from "remeda";
import { PersistentHook } from "./hooks";
import { Wrapper } from "./libwrapper";

function joinStr(separator: string, ...path: any[]): string {
    return R.pipe(
        path, //
        R.flat(),
        R.filter(R.isString),
        R.join(separator)
    );
}

function arraysEqual<T extends any[]>(arr1: T, arr2: any[]): arr2 is T {
    arr1 = R.unique(arr1) as unknown as T;
    arr2 = R.unique(arr2);
    return arr1.length === arr2.length && arr1.every((entry) => arr2.includes(entry));
}

function roundToStep(value: number, step: number): number {
    step = value < 0 ? step * -1 : step;
    const half = step / 2;
    return value + half - ((value + half) % step);
}

function isDecimal(num: number): boolean {
    return num % 1 !== 0;
}

function activateHooksAndWrappers(entries: (Wrapper | PersistentHook)[]) {
    for (const entry of entries) {
        entry.activate();
    }
}

function disableHooksAndWrappers(entries: (Wrapper | PersistentHook)[]) {
    for (const entry of entries) {
        entry.disable();
    }
}

function toggleHooksAndWrappers(entries: (Wrapper | PersistentHook)[], enabled: boolean) {
    for (const entry of entries) {
        entry.toggle(enabled);
    }
}

function removeIndexFromArray<T extends any[]>(array: T, index: number, copy = true): T {
    const usedArray = (copy ? array.slice() : array) as T;
    if (index < 0 || index >= array.length) return usedArray;

    usedArray.splice(index, 1);
    return usedArray;
}

function rollDie(faces: number, nb = 1) {
    let total = 0;
    for (let i = 0; i < nb; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}

function stringBoolean(b: boolean | string): `${boolean}` {
    return String(b) as `${boolean}`;
}

function stringNumber(b: number | string): `${number}` {
    return String(b) as `${number}`;
}

function localeCompare(a: string, b: string) {
    return a.localeCompare(b, game.i18n.lang);
}

function sortByLocaleCompare<T extends Record<string, any>>(list: Array<T>, key: keyof T) {
    list.sort((a, b) => localeCompare(a[key], b[key]));
}

// this returns all the getters of an instance object into a plain data object
function gettersToData<T extends Object>(instance: T): ExtractReadonly<T> {
    const Cls = instance.constructor as ConstructorOf<T>;
    const keys = Object.entries(Object.getOwnPropertyDescriptors(Cls.prototype))
        .filter(([key, descriptor]) => typeof descriptor.get === "function")
        .map(([key]) => key) as ReadonlyKeys<T>[];

    const obj = {} as ExtractReadonly<T>;

    for (const key of keys) {
        obj[key] = instance[key];
    }

    return obj;
}

export {
    activateHooksAndWrappers,
    arraysEqual,
    disableHooksAndWrappers,
    gettersToData,
    isDecimal,
    joinStr,
    localeCompare,
    removeIndexFromArray,
    rollDie,
    roundToStep,
    sortByLocaleCompare,
    stringBoolean,
    stringNumber,
    toggleHooksAndWrappers,
};
