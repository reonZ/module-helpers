import { R } from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/util/misc.ts#L259
 */
function splitListString(
    str: string,
    { delimiter = ",", unique = true }: SplitListStringOptions = {}
): string[] {
    const list = str
        .split(delimiter)
        .map((el) => el.trim())
        .filter((el) => el !== "");
    return unique ? R.unique(list) : list;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/util/misc.ts#L58
 */
function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T> {
    return set.has(value);
}

/**
 * https://github.com/foundryvtt/pf2e/blob/78e7f116221c6138e4f3d7e03177bd85936c6939/src/util/misc.ts#L216
 */
function ErrorPF2e(message: string): Error {
    return Error(`PF2e System | ${message}`);
}

/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/util/tags.ts#L8
 */
function traitSlugToObject(
    trait: string,
    dictionary: Record<string, string | undefined>
): TraitViewData {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject: TraitViewData = {
        name: trait,
        label: game.i18n.localize(dictionary[trait] ?? trait),
        description: null,
    };
    if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
        traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
    }

    return traitObject;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/util/misc.ts#L48
 */
function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/sheet/helpers.ts#L125
 */
function isRelevantEvent(
    event: Maybe<Event>
): event is MouseEvent | TouchEvent | KeyboardEvent | WheelEvent {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/sheet/helpers.ts#L149
 */
function eventToRollMode(event: Maybe<Event>): RollMode | "roll" {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey)) return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/module/system/text-editor.ts#L344
 */
function parseInlineParams(
    paramString: string,
    options: { first?: string } = {}
): Record<string, string | undefined> | null {
    const parts = splitListString(paramString, { delimiter: "|" });
    const result = parts.reduce((result, part, idx) => {
        if (idx === 0 && options.first && !part.includes(":")) {
            result[options.first] = part.trim();
            return result;
        }

        const colonIdx = part.indexOf(":");
        const portions =
            colonIdx >= 0 ? [part.slice(0, colonIdx), part.slice(colonIdx + 1)] : [part, ""];
        result[portions[0]] = portions[1];

        return result;
    }, {} as Record<string, string | undefined>);

    return result;
}

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

export {
    ErrorPF2e,
    eventToRollMode,
    objectHasKey,
    parseInlineParams,
    setHasElement,
    splitListString,
    traitSlugToObject,
};
