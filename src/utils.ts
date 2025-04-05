import * as R from "remeda";

function joinStr(separator: "/" | "." | "-", ...path: any[]) {
    return R.pipe(path, R.flat(), R.filter(R.isString), R.join(separator));
}

export { joinStr };
