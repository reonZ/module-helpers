import { CheckRoll, DegreeOfSuccessString, StatisticDifficultyClass, ZeroToThree } from "foundry-pf2e";
declare const DEGREE_STRINGS: readonly ["criticalFailure", "failure", "success", "criticalSuccess"];
declare const DEGREE_VALUES: Record<ZeroToThree | DegreeOfSuccessString, ZeroToThree>;
declare const DEGREE_ADJUSTMENT_AMOUNTS: {
    readonly LOWER_BY_TWO: -2;
    readonly LOWER: -1;
    readonly INCREASE: 1;
    readonly INCREASE_BY_TWO: 2;
    readonly TO_CRITICAL_FAILURE: "criticalFailure";
    readonly TO_FAILURE: "failure";
    readonly TO_SUCCESS: "success";
    readonly TO_CRITICAL_SUCCESS: "criticalSuccess";
};
/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/system/degree-of-success.ts#L8
 */
declare class DegreeOfSuccess {
    #private;
    /** The calculated degree of success */
    readonly value: DegreeOfSuccessIndex;
    /** The degree of success prior to adjustment. If there was no adjustment, it is identical to the `value` */
    readonly unadjusted: DegreeOfSuccessIndex;
    /** A degree adjustment, usually from some character ability */
    readonly adjustment: {
        label: string;
        amount: DegreeAdjustmentAmount;
    } | null;
    /** The result of a d20 roll */
    readonly dieResult: number;
    /** The total of a roll, including the die result and total modifier */
    readonly rollTotal: number;
    /** The check DC being rolled against */
    readonly dc: CheckDC;
    constructor(roll: Rolled<CheckRoll> | RollBrief, dc: CheckDC | number, dosAdjustments?: DegreeAdjustmentsRecord | null);
    static readonly CRITICAL_FAILURE = 0;
    static readonly FAILURE = 1;
    static readonly SUCCESS = 2;
    static readonly CRITICAL_SUCCESS = 3;
}
declare function degreeOfSuccessNumber(value: Maybe<string | number>): ZeroToThree | undefined;
declare function degreeOfSuccessString(value: number): DegreeOfSuccessString | undefined;
declare function isDegreeOfSuccessValue(value: unknown): value is ZeroToThree | DegreeOfSuccessString;
type RollBrief = {
    dieValue: number;
    modifier: number;
};
type DegreeAdjustmentAmount = (typeof DEGREE_ADJUSTMENT_AMOUNTS)[keyof typeof DEGREE_ADJUSTMENT_AMOUNTS];
type DegreeAdjustmentsRecord = {
    [key in "all" | DegreeOfSuccessString]?: {
        label: string;
        amount: DegreeAdjustmentAmount;
    };
};
interface CheckDC {
    slug?: string | null;
    statistic?: StatisticDifficultyClass | null;
    label?: string;
    scope?: "attack" | "check";
    value: number;
    visible?: boolean;
}
type DegreeOfSuccessIndex = ZeroToThree;
export { DEGREE_ADJUSTMENT_AMOUNTS, DEGREE_STRINGS, DEGREE_VALUES, DegreeOfSuccess, degreeOfSuccessNumber, degreeOfSuccessString, isDegreeOfSuccessValue, };
