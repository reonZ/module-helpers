import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";

export {};

declare global {
    type Prettify<T> = { [K in keyof T]: T[K] } & {};

    type Promisable<T> = Promise<T> | T;

    type TypeOfType =
        | "bigint"
        | "boolean"
        | "function"
        | "number"
        | "object"
        | "string"
        | "synbol"
        | undefined;

    type TargetDocuments = { actor: ActorPF2e; token?: TokenDocumentPF2e | null };

    type MaybeHTML = Maybe<Document | Element | EventTarget>;

    type EventType = keyof HTMLElementEventMap;

    type SocketCallback<T = any> = (packet: T, senderId: string) => void;

    type StringNumber = `${number}`;
    type StringBoolean = `${boolean}`;

    type SelectOption<V extends string = string> = { value: V; label: string };
    type SelectOptions<V extends string = string> = SelectOption<V>[];

    type Merge<T extends object> = {
        [k in T extends any ? keyof T : never]?: T extends { [l in k]?: infer V } ? V : never;
    };

    type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
        {
            [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
        }[Keys];

    type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
        {
            [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
        }[Keys];

    type RequiredFieldsOnly<T> = {
        [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
    };

    type PartialFieldsOnly<T> = Omit<T, keyof RequiredFieldsOnly<T>>;

    type PartialRecord<K extends string | number | symbol, V> = Partial<Record<K, V>>;

    type WithRequired<T extends Record<string, any>, K extends keyof T> = Omit<T, K> &
        Required<Pick<T, K>>;

    type RequiredExcept<T extends Record<string, any>, K extends keyof T> = Required<Omit<T, K>> &
        Pick<T, K>;

    type WithPartial<T extends Record<string, any>, K extends keyof T> = Omit<T, K> &
        Partial<Pick<T, K>>;

    type PartialExcept<T extends Record<string, any>, K extends keyof T> = Partial<Omit<T, K>> &
        Pick<T, K>;

    type Pairs<T> = Array<{ [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]>;

    type Widen<T> = { [key in keyof T]: ToPrimitive<T[key]> };

    type ToPrimitive<T> = T extends string
        ? string
        : T extends number
        ? number
        : T extends boolean
        ? boolean
        : T extends (..._args: any[]) => any
        ? (..._args: Parameters<T>) => ReturnType<T>
        : T extends object
        ? { [key in keyof T]: ToPrimitive<T[key]> }
        : T;

    type PrimitiveOf<T> = T extends StringConstructor
        ? string
        : T extends NumberConstructor
        ? number
        : T extends BooleanConstructor
        ? boolean
        : never;

    type ExtractSelectionOption<
        T extends ReadonlyArray<string | { value: string; label: string }>
    > = T[number] extends string
        ? T[number]
        : T[number] extends { value: infer V extends string }
        ? V
        : never;
}
