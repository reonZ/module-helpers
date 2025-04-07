import { AbilityTrait, ZeroToThree } from "foundry-pf2e";
import * as R from "remeda";

function isDegreeOfSuccessNumber(value: any): value is ZeroToThree {
    return R.isNumber(value) && value >= 0 && value <= 3;
}

function getExtraRollOptions(
    { traits, options }: { traits?: string[]; options?: string[] } = {},
    isBasic?: boolean
): string[] {
    const maybeTraits = traits ?? [];
    const additionalTraits = maybeTraits.filter(
        (t): t is AbilityTrait => t in CONFIG.PF2E.actionTraits
    );

    const allOptions = options?.slice() ?? [];

    if (isBasic && !allOptions.includes("damaging-effect")) {
        allOptions.push("damaging-effect");
    }

    return R.unique(
        [maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), allOptions].flat()
    );
}

export { getExtraRollOptions, isDegreeOfSuccessNumber };
