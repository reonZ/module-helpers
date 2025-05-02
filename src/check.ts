import { AbilityTrait, ZeroToThree } from "foundry-pf2e";
import { R, splitStr } from ".";

function isDegreeOfSuccessNumber(value: any): value is ZeroToThree {
    return R.isNumber(value) && value >= 0 && value <= 3;
}

/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/d179b37b0389a1d6b238f3dd2ad125a04b958184/src/scripts/ui/inline-roll-links.ts#L176
 * automatically add "damaging-effect" option if check is a basic save
 * traits & options can also be arrays of strings
 */
function getExtraRollOptions(
    { traits, options }: { traits?: string[] | string; options?: string[] | string } = {},
    isBasic?: boolean
): string[] {
    const maybeTraits = R.isString(traits) ? splitStr(",", traits) : traits ?? [];
    const additionalTraits = maybeTraits.filter(
        (t): t is AbilityTrait => t in CONFIG.PF2E.actionTraits
    );

    const allOptions = R.isString(options) ? splitStr(",", options) : options?.slice() ?? [];

    if (isBasic && !allOptions.includes("damaging-effect")) {
        allOptions.push("damaging-effect");
    }

    return R.unique(
        [maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), allOptions].flat()
    );
}

export { getExtraRollOptions, isDegreeOfSuccessNumber };
