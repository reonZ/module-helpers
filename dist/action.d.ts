import { ActionCost } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L205
 */
declare function getActionGlyph(action: string | number | null | ActionCost): string;
export { getActionGlyph };
