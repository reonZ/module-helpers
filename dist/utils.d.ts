import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";
declare function joinStr(separator: "/" | "." | "-", ...path: any[]): string;
declare function stringBoolean(b: boolean | string): "false" | "true";
declare function stringNumber(n: number | string): `${number}`;
declare function beautifySlug(slug: string): string;
declare function compareArrays<T extends any>(arr1: T[], arr2: T[], unique?: boolean): boolean;
declare function arrayIncludes(array: string[], other: string[]): boolean;
declare function getUuidFromInlineMatch(match: RegExpExecArray | RegExpMatchArray): string;
declare function removeIndexFromArray<T extends any[]>(array: T, index: number, copy?: boolean): T;
declare function rollDie(faces: number, nb?: number): number;
declare function indexObjToArray<T>(obj: Maybe<Record<`${number}`, T> | T[]>): T[];
declare function roundToStep(value: number, step: number): number;
declare function nextPowerOf2(value: number): number;
declare function setHasAny<T>(set: Set<T>, ...entries: T[]): boolean;
declare function isValidTargetDocuments(target: Maybe<{
    actor: Maybe<ActorPF2e>;
    token?: TokenDocumentPF2e | null;
}>): target is TargetDocuments;
export { arrayIncludes, beautifySlug, compareArrays, getUuidFromInlineMatch, indexObjToArray, isValidTargetDocuments, joinStr, nextPowerOf2, removeIndexFromArray, rollDie, roundToStep, setHasAny, stringBoolean, stringNumber, };
