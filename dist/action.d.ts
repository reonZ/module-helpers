import { AbilityItemPF2e, ActionCost, ActorPF2e, ChatMessagePF2e, ConsumablePF2e, EffectPF2e, EquipmentPF2e, FeatPF2e, SpellPF2e } from "foundry-pf2e";
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
declare function updateActionFrequency<T extends AbilityItemPF2e | FeatPF2e>(action: T): Promise<T | undefined>;
declare function useAction(event: Event, item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>): Promise<ChatMessagePF2e | null | undefined>;
/**
 * converted version of
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/chat-message/helpers.ts#L16
 * https://github.com/foundryvtt/pf2e/blob/98ee106cc8faf8ebbcbbb7b612b3b267645ef91e/src/module/apps/sidebar/chat-log.ts#L121
 */
declare function useSelfAppliedAction(item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e> | SpellPF2e<ActorPF2e> | EquipmentPF2e<ActorPF2e> | ConsumablePF2e<ActorPF2e>, rollMode: RollMode | "roll" | Event | undefined, effect?: EffectPF2e | null): Promise<ChatMessagePF2e | undefined>;
export { getActionGlyph, getActionIcon, isDefaultActionIcon, updateActionFrequency, useAction, useSelfAppliedAction, };
