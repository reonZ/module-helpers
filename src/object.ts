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

class MapOfArrays<T, K extends string | number = string | number> extends Map<K, T[]> {
    constructor(
        entries?:
            | readonly (readonly [K, T[]])[]
            | Iterable<readonly [K, T[]]>
            | Record<K, T[]>
            | null
    ) {
        if (entries && !(Symbol.iterator in entries)) {
            super(Object.entries(entries) as [K, T[]][]);
        } else {
            super(entries);
        }
    }

    add(key: K, entry: T | T[], create = true) {
        const entries = R.isArray(entry) ? entry : [entry];
        const arr = this.get(key, create);
        arr?.push(...entries);
    }

    get(key: K, create: true): T[];
    get(key: K, create?: boolean): T[] | undefined;
    get(key: K, create = false) {
        const exist = super.get(key);

        if (exist || !create) {
            return exist;
        } else {
            const arr: T[] = [];

            this.set(key, arr);
            return arr;
        }
    }

    remove(key: K, entry: T): T | null {
        const arr = this.get(key);
        return arr?.findSplice((x) => x === entry) ?? null;
    }

    removeBy(key: K, fn: (entry: T) => boolean): T | null {
        const arr = this.get(key);
        return arr?.findSplice(fn) ?? null;
    }

    map<U>(fn: (value: T[], key: K, index: number, data: this) => U): U[] {
        let index = 0;
        const transformed: U[] = [];

        for (const [key, value] of this.entries()) {
            transformed.push(fn(value, key, index, this));
            index++;
        }

        return transformed;
    }

    toObject(): Record<K, T[]> {
        return Object.fromEntries(this) as Record<K, T[]>;
    }

    toJSON(): Record<K, T[]> {
        return this.toObject();
    }
}

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

// decorator to assure the method is only ever called once
function onceDecorator() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let processed = false;
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (processed) return;
            processed = true;
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
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

export {
    addToObjectIfNonNullish,
    gettersToData,
    isInstanceOf,
    MapOfArrays,
    objectIsIn,
    onceDecorator,
};
export type { IsInstanceOfItem, IsInstanceOfItems };
