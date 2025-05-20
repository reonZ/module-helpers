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
export { ErrorPF2e, setHasElement };
