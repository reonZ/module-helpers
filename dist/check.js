import { R, splitStr } from ".";
const DEGREE_VALUES = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    criticalFailure: 0,
    failure: 1,
    success: 2,
    criticalSuccess: 3,
};
function isDegreeOfSuccessValue(value) {
    return value in DEGREE_VALUES;
}
function degreeOfSuccessNumber(value) {
    return isDegreeOfSuccessValue(value) ? DEGREE_VALUES[value] : undefined;
}
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/d179b37b0389a1d6b238f3dd2ad125a04b958184/src/scripts/ui/inline-roll-links.ts#L176
 * automatically add "damaging-effect" option if check is a basic save
 * traits & options can also be arrays of strings
 */
function getExtraRollOptions({ traits, options } = {}, isBasic) {
    const maybeTraits = R.isString(traits) ? splitStr(traits) : traits ?? [];
    const additionalTraits = maybeTraits.filter((t) => t in CONFIG.PF2E.actionTraits);
    const allOptions = R.isString(options) ? splitStr(options) : options?.slice() ?? [];
    if (isBasic && !allOptions.includes("damaging-effect")) {
        allOptions.push("damaging-effect");
    }
    return R.unique([maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), allOptions].flat());
}
export { degreeOfSuccessNumber, getExtraRollOptions, isDegreeOfSuccessValue };
