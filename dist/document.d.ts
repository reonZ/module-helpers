import { DamageInstance, DamageRoll } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
declare function getInMemory<T>(obj: object, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: object, ...args: [...string[], T]): boolean;
declare function deleteInMemory(obj: object, ...path: string[]): boolean;
export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, setInMemory };
