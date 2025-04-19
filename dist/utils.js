import * as R from "remeda";
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}
function objectHasKey(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}
export { joinStr, objectHasKey };
