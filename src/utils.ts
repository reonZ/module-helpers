import * as R from "remeda";
import { PersistentHook } from "./hooks";
import { Wrapper } from "./libwrapper";

function joinStr(separator: StringSeparator, ...path: any[]): string {
    return R.pipe(
        path, //
        R.flat(),
        R.filter(R.isString),
        R.join(separator)
    );
}

function splitStr(str: string, separator: StringSeparator = ","): string[] {
    return R.pipe(
        str,
        R.split(separator),
        R.map((x) => x.trim()),
        R.filter(R.isTruthy)
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

type StringSeparator = "/" | "." | "-" | ",";

export {
    activateHooksAndWrappers,
    disableHooksAndWrappers,
    isDecimal,
    joinStr,
    roundToStep,
    splitStr,
    toggleHooksAndWrappers,
};
