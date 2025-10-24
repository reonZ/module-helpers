import {
    AbstractEffectPF2e,
    ActorPF2e,
    ArithmeticExpression,
    ChatMessagePF2e,
    ConsumablePF2e,
    CreatureConfig,
    CreaturePF2e,
    DamageRoll,
    EffectPF2e,
    FeatPF2e,
    Grouping,
    ItemPF2e,
    LootPF2e,
    MacroPF2e,
    SpellcastingEntryPF2e,
    SpellPF2e,
    TokenDocumentPF2e,
    TokenPF2e,
    WeaponPF2e,
} from "foundry-pf2e";
import { R } from ".";

function objectIsIn<
    T,
    O extends Record<string, unknown> = Record<string, unknown>,
    K extends string = string
>(obj: Readonly<Record<PropertyKey, unknown>> | O, key: K): obj is NarrowedTo<O, Record<K, T>> {
    return key in obj && R.isObjectType(obj[key]);
}

function isInstanceOf<T extends keyof IsInstanceOfClasses>(
    obj: any,
    cls: T
): obj is IsInstanceOfClasses[T];
function isInstanceOf<T>(obj: any, cls: string): obj is T;
function isInstanceOf(obj: any, cls: keyof IsInstanceOfClasses | string) {
    if (typeof obj !== "object" || obj === null) return false;

    let cursor = Reflect.getPrototypeOf(obj);
    while (cursor) {
        if (cursor.constructor.name === cls) return true;
        cursor = Reflect.getPrototypeOf(cursor);
    }

    return false;
}

function addToObjectIfNonNullish<T extends Record<string, any>, E extends Record<string, any>>(
    obj: T & Partial<E>,
    extra: E
): T & Partial<E> {
    for (const [key, value] of R.entries(extra)) {
        if (value != null) {
            obj[key as keyof T] = value;
        }
    }

    return obj;
}

// this returns all the getters of an instance object into a plain data object
function gettersToData<T extends Object>(instance: T): ExtractReadonly<T> {
    const Cls = instance.constructor as ConstructorOf<T>;
    const keys = Object.entries(Object.getOwnPropertyDescriptors(Cls.prototype))
        .filter(([key, descriptor]) => typeof descriptor.get === "function")
        .map(([key]) => key) as ReadonlyKeys<T>[];

    const obj = {} as ExtractReadonly<T>;

    for (const key of keys) {
        obj[key] = instance[key];
    }

    return obj;
}

type IsInstanceOfClasses = IsInstanceOfItems & {
    ActorPF2e: ActorPF2e;
    ArithmeticExpression: ArithmeticExpression;
    ChatMessagePF2e: ChatMessagePF2e;
    ClientDocumentMixin: ClientDocument;
    CreatureConfig: CreatureConfig<CreaturePF2e>;
    DamageRoll: DamageRoll;
    Grouping: Grouping;
    LootPF2e: LootPF2e;
    MacroPF2e: MacroPF2e;
    TokenPF2e: TokenPF2e;
    TokenDocumentPF2e: TokenDocumentPF2e;
};

type IsInstanceOfItems = {
    AbstractEffectPF2e: AbstractEffectPF2e;
    ConsumablePF2e: ConsumablePF2e;
    EffectPF2e: EffectPF2e;
    FeatPF2e: FeatPF2e;
    ItemPF2e: ItemPF2e;
    SpellcastingEntryPF2e: SpellcastingEntryPF2e;
    SpellPF2e: SpellPF2e;
    WeaponPF2e: WeaponPF2e;
};

type IsInstanceOfItem = keyof IsInstanceOfItems;

export { addToObjectIfNonNullish, gettersToData, isInstanceOf, objectIsIn };
export type { IsInstanceOfItem, IsInstanceOfItems };
