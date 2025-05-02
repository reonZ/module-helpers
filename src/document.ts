import { DamageInstance, DamageRoll } from "foundry-pf2e";

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

export { getDamageRollClass, getDamageInstanceClass };
