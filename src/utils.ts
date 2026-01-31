import * as R from "remeda";
import { PersistentHook } from "./hooks";
import { Wrapper } from "./libwrapper";

function joinStr(separator: string, ...path: any[]): string {
    return R.pipe(
        path, //
        R.flat(),
        R.filter((x) => R.isString(x) && !!x),
        R.join(separator),
    );
}

function splitStr<T extends string>(str: string, separator = ","): T[] {
    return R.pipe(
        str,
        R.split(separator),
        R.filter(R.isString),
        R.map((x) => x.trim() as T),
    );
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

function waitTimeout(time: number = 1): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function mapToObjByKey<
    T extends Record<string, any>,
    K extends ExtractKeysForType<T, string> = ExtractKeysForType<T, string>,
>(arr: T[], key: K): Record<T[K], T> {
    return R.pipe(
        arr,
        R.map((entry) => {
            return [entry[key], entry] as const;
        }),
        R.fromEntries(),
    );
}

function isIterable(obj: unknown): obj is IterableIterator<any> {
    return R.isObjectType(obj) && Symbol.iterator in obj && typeof obj[Symbol.iterator] === "function";
}

function recordToSelectOptions(
    record: Record<string, string | undefined>,
): { value: string; label: string | undefined }[] {
    return R.pipe(
        record,
        R.entries(),
        R.map(([value, label]) => {
            return { value, label };
        }),
    );
}

export {
    activateHooksAndWrappers,
    disableHooksAndWrappers,
    isDecimal,
    isIterable,
    joinStr,
    localeCompare,
    mapToObjByKey,
    recordToSelectOptions,
    rollDie,
    roundToStep,
    sortByLocaleCompare,
    splitStr,
    stringBoolean,
    stringNumber,
    toggleHooksAndWrappers,
    waitTimeout,
};
