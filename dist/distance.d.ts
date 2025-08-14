/**
 * the helpers in this file are repurposed version of the system to use token destination instead of position
 */
import { TokenPF2e } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/f26bfcc353ebd58efd6d1140cdb8e20688acaea8/src/module/canvas/token/object.ts#L478
 */
declare function distanceBetween(origin: TokenPF2e, target: TokenPF2e): number;
export { distanceBetween };
