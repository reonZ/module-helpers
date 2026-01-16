import { CheckRoll, DegreeOfSuccessString, StatisticDifficultyClass, ZeroToThree } from "foundry-pf2e";
import { Die } from "foundry-pf2e/foundry/client-esm/dice/terms/die.js";
import { NumericTerm } from "foundry-pf2e/foundry/client-esm/dice/terms/numeric-term.js";
import { R } from ".";

const DEGREE_STRINGS = ["criticalFailure", "failure", "success", "criticalSuccess"] as const;

const DEGREE_VALUES: Record<ZeroToThree | DegreeOfSuccessString, ZeroToThree> = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    criticalFailure: 0,
    failure: 1,
    success: 2,
    criticalSuccess: 3,
};

const DEGREE_ADJUSTMENT_AMOUNTS = {
    LOWER_BY_TWO: -2,
    LOWER: -1,
    INCREASE: 1,
    INCREASE_BY_TWO: 2,
    TO_CRITICAL_FAILURE: "criticalFailure",
    TO_FAILURE: "failure",
    TO_SUCCESS: "success",
    TO_CRITICAL_SUCCESS: "criticalSuccess",
} as const;

/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/system/degree-of-success.ts#L8
 */
class DegreeOfSuccess {
    /** The calculated degree of success */
    readonly value: DegreeOfSuccessIndex;

    /** The degree of success prior to adjustment. If there was no adjustment, it is identical to the `value` */
    readonly unadjusted: DegreeOfSuccessIndex;

    /** A degree adjustment, usually from some character ability */
    readonly adjustment: { label: string; amount: DegreeAdjustmentAmount } | null;

    /** The result of a d20 roll */
    readonly dieResult: number;

    /** The total of a roll, including the die result and total modifier */
    readonly rollTotal: number;

    /** The check DC being rolled against */
    readonly dc: CheckDC;

    constructor(
        roll: Rolled<CheckRoll> | RollBrief,
        dc: CheckDC | number,
        dosAdjustments: DegreeAdjustmentsRecord | null = null,
    ) {
        if (roll instanceof Roll) {
            this.dieResult =
                (roll.isDeterministic
                    ? roll.terms.find((t): t is NumericTerm => t instanceof foundry.dice.terms.NumericTerm)
                    : roll.dice.find((d): d is Die => d instanceof foundry.dice.terms.Die && d.faces === 20)
                )?.total ?? 1;
            this.rollTotal = roll.total;
        } else {
            this.dieResult = roll.dieValue;
            this.rollTotal = roll.dieValue + roll.modifier;
        }

        this.dc = typeof dc === "number" ? { value: dc } : dc;

        this.unadjusted = this.#calculateDegreeOfSuccess();
        this.adjustment = this.#getDegreeAdjustment(this.unadjusted, dosAdjustments);
        this.value = this.adjustment
            ? this.#adjustDegreeOfSuccess(this.adjustment.amount, this.unadjusted)
            : this.unadjusted;
    }

    static readonly CRITICAL_FAILURE = 0;
    static readonly FAILURE = 1;
    static readonly SUCCESS = 2;
    static readonly CRITICAL_SUCCESS = 3;

    #getDegreeAdjustment(
        degree: DegreeOfSuccessIndex,
        adjustments: DegreeAdjustmentsRecord | null,
    ): { label: string; amount: DegreeAdjustmentAmount } | null {
        if (!adjustments) return null;

        for (const outcome of ["all", ...DEGREE_STRINGS] as const) {
            const { label, amount } = adjustments[outcome] ?? {};
            if (
                amount &&
                label &&
                !(degree === DegreeOfSuccess.CRITICAL_SUCCESS && amount === DEGREE_ADJUSTMENT_AMOUNTS.INCREASE) &&
                !(degree === DegreeOfSuccess.CRITICAL_FAILURE && amount === DEGREE_ADJUSTMENT_AMOUNTS.LOWER) &&
                (outcome === "all" || DEGREE_STRINGS.indexOf(outcome) === degree)
            ) {
                return { label, amount };
            }
        }

        return null;
    }

    #adjustDegreeOfSuccess(
        amount: DegreeAdjustmentAmount,
        degreeOfSuccess: DegreeOfSuccessIndex,
    ): DegreeOfSuccessIndex {
        switch (amount) {
            case "criticalFailure":
                return 0;
            case "failure":
                return 1;
            case "success":
                return 2;
            case "criticalSuccess":
                return 3;
            default:
                return Math.clamp(degreeOfSuccess + amount, 0, 3) as DegreeOfSuccessIndex;
        }
    }

    /**
     * @param degree The current success value
     * @return The new success value
     */
    #adjustDegreeByDieValue(degree: DegreeOfSuccessIndex): DegreeOfSuccessIndex {
        if (this.dieResult === 20) {
            return this.#adjustDegreeOfSuccess(DEGREE_ADJUSTMENT_AMOUNTS.INCREASE, degree);
        } else if (this.dieResult === 1) {
            return this.#adjustDegreeOfSuccess(DEGREE_ADJUSTMENT_AMOUNTS.LOWER, degree);
        }

        return degree;
    }

    #calculateDegreeOfSuccess(): DegreeOfSuccessIndex {
        const dc = this.dc.value;

        if (this.rollTotal - dc >= 10) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.CRITICAL_SUCCESS);
        } else if (dc - this.rollTotal >= 10) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.CRITICAL_FAILURE);
        } else if (this.rollTotal >= dc) {
            return this.#adjustDegreeByDieValue(DegreeOfSuccess.SUCCESS);
        }

        return this.#adjustDegreeByDieValue(DegreeOfSuccess.FAILURE);
    }
}

function degreeOfSuccessNumber(value: string | number | undefined): ZeroToThree | undefined {
    return DEGREE_VALUES[value as ZeroToThree];
}

function degreeOfSuccessString(value: number): DegreeOfSuccessString | undefined {
    return DEGREE_STRINGS.at(value);
}

function isDegreeOfSuccessValue(value: unknown): value is ZeroToThree | DegreeOfSuccessString {
    return (R.isString(value) || R.isNumber(value)) && value in DEGREE_VALUES;
}

type RollBrief = { dieValue: number; modifier: number };

type DegreeAdjustmentAmount = (typeof DEGREE_ADJUSTMENT_AMOUNTS)[keyof typeof DEGREE_ADJUSTMENT_AMOUNTS];

type DegreeAdjustmentsRecord = {
    [key in "all" | DegreeOfSuccessString]?: { label: string; amount: DegreeAdjustmentAmount };
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

export {
    DEGREE_ADJUSTMENT_AMOUNTS,
    DEGREE_STRINGS,
    DEGREE_VALUES,
    DegreeOfSuccess,
    degreeOfSuccessNumber,
    degreeOfSuccessString,
    isDegreeOfSuccessValue,
};
