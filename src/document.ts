import { DamageInstance, DamageRoll } from "foundry-pf2e";
import { MODULE } from "./module";

let _DamageRoll: typeof DamageRoll;
let _DamageInstance: typeof DamageInstance;

function getDamageRollClass(): typeof DamageRoll {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageRoll"
    ) as typeof DamageRoll);
}

function getDamageInstanceClass(): typeof DamageInstance {
    return (_DamageInstance ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageInstance"
    ) as typeof DamageInstance);
}

function getInMemory<T>(obj: object, ...path: string[]): T | undefined {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

function setInMemory<T>(obj: object, ...args: [...string[], T]): boolean {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}

function deleteInMemory(obj: object, ...path: string[]) {
    return foundry.utils.deleteProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, setInMemory };
