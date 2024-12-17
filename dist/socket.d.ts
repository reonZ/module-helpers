declare function socketOn<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketOff<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketEmit<T extends object = object>(packet: T): void;
declare function createCallOrEmit<TType extends string, TOptions extends Record<string, any>, TOptionsWithSocket = WithSocketOptions<TOptions>, TPacket = ExtractSocketOptions<TOptions> & {
    type: TType;
}>(packetType: TType, callback: (options: TOptions, userId: string) => void, socket?: {
    emit: (packet: TPacket) => void;
}): (options: TOptionsWithSocket, userId?: string) => void;
type ExtractSocketOptions<TOptions extends Record<string, any>> = ExtractSocketOptionsRequired<TOptions> & ExtractSocketOptionsPartial<TOptions>;
type ExtractSocketOptionsRequired<TOptions extends Record<string, any>, TRequired = RequiredFieldsOnly<TOptions>> = TRequired extends Record<infer TKey, any> ? {
    [k in TKey]: TRequired[k] extends ClientDocument ? string : TRequired[k];
} : never;
type ExtractSocketOptionsPartial<TOptions extends Record<string, any>, TPartial = PartialFieldsOnly<TOptions>> = TPartial extends Partial<Record<infer TKey, any>> ? {
    [k in TKey]?: TPartial[k] extends ClientDocument | undefined ? string : TPartial[k];
} : never;
type WithSocketOptions<TOptions extends Record<string, any>> = WithSocketOptionsRequired<TOptions> & WithSocketOptionsPartial<TOptions>;
type WithSocketOptionsRequired<TOptions extends Record<string, any>, TRequired = RequiredFieldsOnly<TOptions>> = TRequired extends Record<infer TKey, any> ? {
    [k in TKey]: TRequired[k] extends ClientDocument ? TRequired[k] | string : TRequired[k];
} : never;
type WithSocketOptionsPartial<TOptions extends Record<string, any>, TPartial = PartialFieldsOnly<TOptions>> = TPartial extends Partial<Record<infer TKey, any>> ? {
    [k in TKey]?: TPartial[k] extends ClientDocument | undefined ? TPartial[k] | string : TPartial[k];
} : never;
export { createCallOrEmit, socketEmit, socketOff, socketOn };
export type { ExtractSocketOptions };
