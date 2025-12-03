import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";
declare function socketOn<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketOff<T extends object = object>(callback: SocketCallback<T>): void;
declare function socketEmit<T extends object = object>(packet: T): void;
declare function displayEmiting(): void;
declare function createEmitable<T extends Record<string, any>>(prefix: string, callback: (options: T, userId: string) => void | Promise<void>): Emitable<T>;
declare function convertToCallOptions<T extends EmitableOptions>(options: EmitablePacket<T>): Promise<EmitablePacketOptions<T>>;
declare function convertTargetFromPacket({ actor, token }: {
    actor: string;
    token?: string;
}): Promise<{
    actor: ActorPF2e<TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null> | null;
    token: TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null | undefined;
}>;
declare function convertToEmitOptions<T extends EmitableOptions>(options: T): EmitablePacket<T>;
type Emitable<T> = {
    get enabled(): boolean;
    call: (options: T) => Promise<void>;
    emit: (options: T) => void;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};
type EmitablePacket<T extends EmitableOptions> = EmitablePacketOptions<T> & {
    __type__: string;
    __converter__: EmitableConverted;
};
type EmitableConverted = Record<string, "document" | "target" | "token" | undefined>;
type EmitableOptions = Record<string, any> | any[];
type EmitablePacketOptions<T extends EmitableOptions> = T extends Array<infer V> ? Record<string, V> : T;
export { convertTargetFromPacket, convertToCallOptions, convertToEmitOptions, createEmitable, displayEmiting, socketEmit, socketOff, socketOn, };
export type { EmitableConverted, EmitablePacket };
