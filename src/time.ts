import { R } from ".";

function createTimeout<TArgs extends any[]>(
    callback: (...args: TArgs) => void,
    options?: PersistentTimeoutOptions | number
) {
    let timeoutId: NodeJS.Timeout | null = null;

    const usedOptions = R.isNumber(options) ? { defaultDelay: options } : options;

    const minDelay = Math.max(usedOptions?.minDelay ?? 0, 0);
    const defaultDelay = Math.max(usedOptions?.defaultDelay ?? 1, minDelay);

    return {
        start(...args: TArgs) {
            if (timeoutId !== null) {
                this.stop();
            }

            if (defaultDelay < 1) {
                callback(...args);
            } else {
                timeoutId = setTimeout(callback, defaultDelay, ...args);
            }
        },
        startWithDelay(delay: number, ...args: TArgs) {
            if (timeoutId !== null) {
                this.stop();
            }

            const usedDelay = Math.max(delay, minDelay);

            if (usedDelay < 1) {
                callback(...args);
            } else {
                timeoutId = setTimeout(callback, usedDelay, ...args);
            }
        },
        stop() {
            if (timeoutId === null) return;

            clearTimeout(timeoutId);
            timeoutId = null;
        },
    };
}

type PersistentTimeout<TArgs extends any[] = any[]> = {
    start: (delay: number, ...args: TArgs) => void;
    stop(): void;
};

type PersistentTimeoutOptions = {
    defaultDelay?: number;
    minDelay?: number;
};

export { createTimeout };
export type { PersistentTimeout };
