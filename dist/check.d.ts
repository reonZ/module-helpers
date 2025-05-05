import { DegreeOfSuccessIndex, DegreeOfSuccessString } from "foundry-pf2e";
declare function isDegreeOfSuccessValue(value: string | number): value is DegreeOfSuccessIndex | DegreeOfSuccessString;
declare function degreeOfSuccessNumber(value: string | number): DegreeOfSuccessIndex | undefined;
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/d179b37b0389a1d6b238f3dd2ad125a04b958184/src/scripts/ui/inline-roll-links.ts#L176
 * automatically add "damaging-effect" option if check is a basic save
 * traits & options can also be arrays of strings
 */
declare function getExtraRollOptions({ traits, options }?: {
    traits?: string[] | string;
    options?: string[] | string;
}, isBasic?: boolean): string[];
export { degreeOfSuccessNumber, getExtraRollOptions, isDegreeOfSuccessValue };
