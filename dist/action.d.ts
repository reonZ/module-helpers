import { AbilityItemPF2e, ActionCost, ActorPF2e, FeatPF2e } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L205
 */
declare function getActionGlyph(action: string | number | null | ActionCost): string;
/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L173
 */
declare function getActionIcon(actionType: string | ActionCost | null, fallback: ImageFilePath): ImageFilePath;
declare function getActionIcon(actionType: string | ActionCost | null, fallback: ImageFilePath | null): ImageFilePath | null;
declare function getActionIcon(actionType: string | ActionCost | null): ImageFilePath;
declare function isDefaultActionIcon(img: string, action: string | ActionCost | null): boolean;
declare function useAction(event: Event, item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>): Promise<unknown>;
export { getActionGlyph, getActionIcon, isDefaultActionIcon, useAction };
