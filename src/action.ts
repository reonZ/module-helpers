import { ActionCost } from "foundry-pf2e";

/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L188C1-L199C3
 */
const actionGlyphMap: Record<string, string> = {
    0: "F",
    free: "F",
    1: "1",
    2: "2",
    3: "3",
    "1 or 2": "1/2",
    "1 to 3": "1 - 3",
    "2 or 3": "2/3",
    "2 rounds": "3,3",
    reaction: "R",
};

/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L160C1-L171C3
 */
const actionImgMap: Record<string, ImageFilePath> = {
    0: "systems/pf2e/icons/actions/FreeAction.webp",
    free: "systems/pf2e/icons/actions/FreeAction.webp",
    1: "systems/pf2e/icons/actions/OneAction.webp",
    2: "systems/pf2e/icons/actions/TwoActions.webp",
    3: "systems/pf2e/icons/actions/ThreeActions.webp",
    "1 or 2": "systems/pf2e/icons/actions/OneTwoActions.webp",
    "1 to 3": "systems/pf2e/icons/actions/OneThreeActions.webp",
    "2 or 3": "systems/pf2e/icons/actions/TwoThreeActions.webp",
    reaction: "systems/pf2e/icons/actions/Reaction.webp",
    passive: "systems/pf2e/icons/actions/Passive.webp",
};

/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L205
 */
function getActionGlyph(action: string | number | null | ActionCost): string {
    if (!action && action !== 0) return "";

    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();

    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}

/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L173
 */
function getActionIcon(
    actionType: string | ActionCost | null,
    fallback: ImageFilePath
): ImageFilePath;
function getActionIcon(
    actionType: string | ActionCost | null,
    fallback: ImageFilePath | null
): ImageFilePath | null;
function getActionIcon(actionType: string | ActionCost | null): ImageFilePath;
function getActionIcon(
    action: string | ActionCost | null,
    fallback: ImageFilePath | null = "systems/pf2e/icons/actions/Empty.webp"
): ImageFilePath | null {
    if (action === null) return actionImgMap.passive;
    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}

function isDefaultActionIcon(img: string, action: string | ActionCost | null) {
    return img === getActionIcon(action);
}

export { getActionGlyph, getActionIcon, isDefaultActionIcon };
