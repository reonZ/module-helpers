/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/util/misc.ts#L259
 */
declare function splitListString(str: string, { delimiter, unique }?: SplitListStringOptions): string[];
/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/util/misc.ts#L58
 */
declare function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T>;
/**
 * https://github.com/foundryvtt/pf2e/blob/78e7f116221c6138e4f3d7e03177bd85936c6939/src/util/misc.ts#L216
 */
declare function ErrorPF2e(message: string): Error;
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/util/tags.ts#L8
 */
declare function traitSlugToObject(trait: string, dictionary: Record<string, string | undefined>): TraitViewData;
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/util/misc.ts#L48
 */
declare function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O;
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/sheet/helpers.ts#L149
 */
declare function eventToRollMode(event: Maybe<Event>): RollMode | "roll";
/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/sheet/helpers.ts#L132
 */
declare function eventToRollParams(event: Maybe<Event>, rollType: {
    type: "check" | "damage";
}): ParamsFromEvent;
/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/module/system/text-editor.ts#L344
 */
declare function parseInlineParams(paramString: string, options?: {
    first?: string;
}): Record<string, string | undefined> | null;
/**
 * https://github.com/foundryvtt/pf2e/blob/5ebcd0359d1358bb00b76c47e7b84289239234b9/src/util/misc.ts#L226
 */
declare function ordinalString(value: number): string;
/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/util/misc.ts#L352
 */
declare function localizer(prefix: string): (...args: Parameters<Localization["format"]>) => string;
interface SplitListStringOptions {
    delimiter?: string | RegExp;
    unique?: boolean;
}
interface TraitViewData {
    /** The name of this action. */
    name: string;
    /** The label for this action which will be rendered on the UI. */
    label: string;
    /** The roll this trait applies to, if relevant. */
    rollName?: string;
    /** The option that this trait applies to the roll (of type `rollName`). */
    rollOption?: string;
    /** An extra css class added to the UI marker for this trait. */
    cssClass?: string;
    /** The description of the trait */
    description: string | null;
}
type ParamsFromEvent = {
    skipDialog: boolean;
    rollMode?: RollMode | "roll";
};
export { ErrorPF2e, eventToRollMode, eventToRollParams, localizer, objectHasKey, ordinalString, parseInlineParams, setHasElement, splitListString, traitSlugToObject, };
