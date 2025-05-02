import { DamageInstance, DamageRoll } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
export { getDamageRollClass, getDamageInstanceClass };
