import { R } from ".";
/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/util/misc.ts#L259
 */
function splitListString(str, { delimiter = ",", unique = true } = {}) {
    const list = str
        .split(delimiter)
        .map((el) => el.trim())
        .filter((el) => el !== "");
    return unique ? R.unique(list) : list;
}
/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/util/misc.ts#L58
 */
function setHasElement(set, value) {
    return set.has(value);
}
/**
 * https://github.com/foundryvtt/pf2e/blob/78e7f116221c6138e4f3d7e03177bd85936c6939/src/util/misc.ts#L216
 */
function ErrorPF2e(message) {
    return Error(`PF2e System | ${message}`);
}
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/util/tags.ts#L8
 */
function traitSlugToObject(trait, dictionary) {
    // Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
    // in use, which can include what are normally NPC-only traits
    const traitObject = {
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
function objectHasKey(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/sheet/helpers.ts#L125
 */
function isRelevantEvent(event) {
    return !!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event;
}
/**
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/sheet/helpers.ts#L149
 */
function eventToRollMode(event) {
    if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey))
        return "roll";
    return game.user.isGM ? "gmroll" : "blindroll";
}
/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/sheet/helpers.ts#L132
 */
function eventToRollParams(event, rollType) {
    const key = rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
    const skipDefault = !game.user.settings[key];
    if (!isRelevantEvent(event))
        return { skipDialog: skipDefault };
    const params = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
    if (event.ctrlKey || event.metaKey) {
        params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
    }
    return params;
}
/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/module/system/text-editor.ts#L344
 */
function parseInlineParams(paramString, options = {}) {
    const parts = splitListString(paramString, { delimiter: "|" });
    const result = parts.reduce((result, part, idx) => {
        if (idx === 0 && options.first && !part.includes(":")) {
            result[options.first] = part.trim();
            return result;
        }
        const colonIdx = part.indexOf(":");
        const portions = colonIdx >= 0 ? [part.slice(0, colonIdx), part.slice(colonIdx + 1)] : [part, ""];
        result[portions[0]] = portions[1];
        return result;
    }, {});
    return result;
}
let pluralRules;
/**
 * https://github.com/foundryvtt/pf2e/blob/5ebcd0359d1358bb00b76c47e7b84289239234b9/src/util/misc.ts#L226
 */
function ordinalString(value) {
    pluralRules ??= new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}
/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/util/misc.ts#L352
 */
function localizer(prefix) {
    return (...[suffix, formatArgs]) => formatArgs
        ? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
        : game.i18n.localize(`${prefix}.${suffix}`);
}
export { ErrorPF2e, eventToRollMode, eventToRollParams, localizer, objectHasKey, ordinalString, parseInlineParams, setHasElement, splitListString, traitSlugToObject, };
