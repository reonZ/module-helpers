import { ZeroToThree } from "foundry-pf2e";
declare function isDegreeOfSuccessNumber(value: any): value is ZeroToThree;
declare function getExtraRollOptions({ traits, options }?: {
    traits?: string[];
    options?: string[];
}, isBasic?: boolean): string[];
export { getExtraRollOptions, isDegreeOfSuccessNumber };
