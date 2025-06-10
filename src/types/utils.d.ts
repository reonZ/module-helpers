import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";

export {};

declare global {
    type Prettify<T> = { [K in keyof T]: T[K] } & {};

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

    type SelectOption<V extends string = string> = { value: V; label?: string };
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

    type WithUndefined<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & {
        [k in K]: T[k] | undefined;
    };

    type PartialExcept<T extends Record<string, any>, K extends keyof T> = Partial<Omit<T, K>> &
        Pick<T, K>;

    type Pairs<T> = Array<{ [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]>;

    type ToPrimitive<T> = T extends StringConstructor
        ? string
        : T extends NumberConstructor
        ? number
        : T extends BooleanConstructor
        ? boolean
        : never;

    type FromPrimitive<T> = T extends string
        ? StringConstructor
        : T extends number
        ? NumberConstructor
        : T extends boolean
        ? BooleanConstructor
        : ConstructorOf<T>;

    type ExtractSelectionOption<
        T extends ReadonlyArray<string | { value: string; label: string }>
    > = T[number] extends string
        ? T[number]
        : T[number] extends { value: infer V extends string }
        ? V
        : never;

    type ExtractArrayUnion<T> = T extends (infer U)[] | ReadonlyArray<infer U> ? U : T;

    type Writeable<T> = { -readonly [P in keyof T]: T[P] };

    type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

    type CollapseOf<T extends object> = {
        [Key in keyof T & string]: T[Key] extends object
            ? `${Key}` | `${Key}.${CollapseOf<T[Key]>}`
            : `${Key}`;
    }[keyof T & string];

    type Promisable<T> = Promise<T> | T;
}
