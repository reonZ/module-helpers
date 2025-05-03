import { DamageInstance, DamageRoll, MacroPF2e } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
declare function getInMemory<T>(obj: ClientDocument, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: ClientDocument, ...args: [...string[], T]): boolean;
declare function deleteInMemory(obj: ClientDocument, ...path: string[]): boolean;
declare function isClientDocument<T>(doc: T): doc is Extract<T, ClientDocument>;
declare function isScriptMacro(doc: any): doc is MacroPF2e;
export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, isClientDocument, isScriptMacro, setInMemory, };
