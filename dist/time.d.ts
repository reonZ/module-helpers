declare function createTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, options?: PersistentTimeoutOptions | number): {
    start(...args: TArgs): void;
    startWithDelay(delay: number, ...args: TArgs): void;
    stop(): void;
};
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
