import { R } from ".";
function createTimeout(callback, options) {
    let timeoutId = null;
    const usedOptions = R.isNumber(options) ? { defaultDelay: options } : options;
    const minDelay = Math.max(usedOptions?.minDelay ?? 0, 0);
    const defaultDelay = Math.max(usedOptions?.defaultDelay ?? 1, minDelay);
    return {
        start(...args) {
            if (timeoutId !== null) {
                this.stop();
            }
            if (defaultDelay < 1) {
                callback(...args);
            }
            else {
                timeoutId = setTimeout(callback, defaultDelay, ...args);
            }
        },
        startWithDelay(delay, ...args) {
            if (timeoutId !== null) {
                this.stop();
            }
            const usedDelay = Math.max(delay, minDelay);
            if (usedDelay < 1) {
                callback(...args);
            }
            else {
                timeoutId = setTimeout(callback, usedDelay, ...args);
            }
        },
        stop() {
            if (timeoutId === null)
                return;
            clearTimeout(timeoutId);
            timeoutId = null;
        },
    };
}
export { createTimeout };
