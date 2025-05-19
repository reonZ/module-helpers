/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/util/misc.ts#L58
 */
declare function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T>;
export { setHasElement };
