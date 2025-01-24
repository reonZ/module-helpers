import * as R from "remeda";
function isDegreeOfSuccessNumber(value) {
    return R.isNumber(value) && value >= 0 && value <= 3;
}
function getExtraRollOptions({ traits, options, } = {}) {
    const maybeTraits = traits ?? [];
    const additionalTraits = maybeTraits.filter((t) => t in CONFIG.PF2E.actionTraits);
    return R.unique([maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), options ?? []].flat());
}
export { getExtraRollOptions, isDegreeOfSuccessNumber };
