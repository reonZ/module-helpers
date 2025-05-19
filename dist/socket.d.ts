declare function socketOn<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketOff<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketEmit<T extends object = object>(packet: T): void;
declare function createEmitable<T extends Record<string, any>>(prefix: string, callback: (options: T, userId: string) => void | Promise<void>): Emitable<T>;
type WithSocketOptionsRequired<TOptions extends Record<string, any>, TRequired = RequiredFieldsOnly<TOptions>> = TRequired extends Record<infer TKey, any> ? {
    [k in TKey]: TRequired[k] extends ClientDocument ? TRequired[k] | string : TRequired[k];
} : never;
type WithSocketOptionsPartial<TOptions extends Record<string, any>, TPartial = PartialFieldsOnly<TOptions>> = TPartial extends Partial<Record<infer TKey, any>> ? {
    [k in TKey]?: NonNullable<TPartial[k]> extends ClientDocument ? TPartial[k] | string | null : TPartial[k];
} : never;
type WithSocketOptions<TOptions extends Record<string, any>> = Prettify<WithSocketOptionsRequired<TOptions> & WithSocketOptionsPartial<TOptions>>;
type Emitable<TOptions extends Record<string, any>> = {
    get enabled(): boolean;
    call: (options: WithSocketOptions<TOptions>) => Promise<void>;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};
export { createEmitable, socketEmit, socketOff, socketOn };
