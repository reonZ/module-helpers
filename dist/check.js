import { R, splitListString } from ".";
const SAVE_TYPES = ["fortitude", "reflex", "will"];
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/d179b37b0389a1d6b238f3dd2ad125a04b958184/src/scripts/ui/inline-roll-links.ts#L176
 * automatically add "damaging-effect" option if check is a basic save
 * traits & options can also be arrays of strings
 */
function getExtraRollOptions({ traits, options } = {}, isBasic) {
    const maybeTraits = R.isString(traits) ? splitListString(traits) : (traits ?? []);
    const additionalTraits = maybeTraits.filter((t) => t in CONFIG.PF2E.actionTraits);
    const allOptions = R.isString(options) ? splitListString(options) : (options?.slice() ?? []);
    if (isBasic && !allOptions.includes("damaging-effect")) {
        allOptions.push("damaging-effect");
    }
    return R.unique([maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), allOptions].flat());
}
export { SAVE_TYPES, getExtraRollOptions };
