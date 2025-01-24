import { AbilityTrait, ZeroToThree } from "foundry-pf2e";
import * as R from "remeda";

function isDegreeOfSuccessNumber(value: any): value is ZeroToThree {
    return R.isNumber(value) && value >= 0 && value <= 3;
}

function getExtraRollOptions({
    traits,
    options,
}: { traits?: string[]; options?: string[] } = {}): string[] {
    const maybeTraits = traits ?? [];
    const additionalTraits = maybeTraits.filter(
        (t): t is AbilityTrait => t in CONFIG.PF2E.actionTraits
    );

    return R.unique(
        [maybeTraits, additionalTraits.map((t) => `item:trait:${t}`), options ?? []].flat()
    );
}

export { getExtraRollOptions, isDegreeOfSuccessNumber };
