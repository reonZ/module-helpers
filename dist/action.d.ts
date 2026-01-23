import { AbilityItemPF2e, ActionCost, ActorPF2e, FeatPF2e } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L205
 */
declare function getActionGlyph(action: string | number | null | ActionCost): string;
/**
 * https://github.com/foundryvtt/pf2e/blob/6e5481af7bb1e1b9d28d35fb3ad324511c5170d1/src/module/sheet/helpers.ts#L304
 */
declare function getActionIcon(action: ActionIconType, fallback: ImageFilePath): ImageFilePath;
declare function getActionIcon(action: ActionIconType, fallback: ImageFilePath | null): ImageFilePath | null;
declare function getActionIcon(action: ActionIconType): ImageFilePath;
declare function isDefaultActionIcon(img: string, action: string | ActionCost | null): boolean;
declare function useAction(event: Event, item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>): Promise<unknown>;
declare function applySelfEffect(item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>): Promise<void>;
type ActionIconType = string | number | ActionCost | null;
export { applySelfEffect, getActionGlyph, getActionIcon, isDefaultActionIcon, useAction };
