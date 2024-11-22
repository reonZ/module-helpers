import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";

export {};

declare global {
    type Promisable<T> = Promise<T> | T;

    type TargetDocuments = { actor: ActorPF2e; token?: TokenDocumentPF2e };

    type MaybeHTML = Maybe<Document | Element | EventTarget>;

    type EventType = keyof HTMLElementEventMap;

    type SocketCallback<T = any> = (packet: T, senderId: string) => void;

    type StringNumber = `${number}`;
    type StringBoolean = `${boolean}`;

    type Merge<T extends object> = {
        [k in T extends any ? keyof T : never]?: T extends { [l in k]?: infer V } ? V : never;
    };
}
