import {
    ActorPF2e,
    ChatMessagePF2e,
    ConsumablePF2e,
    CreatureConfig,
    CreaturePF2e,
    DamageRoll,
    EffectPF2e,
    FeatPF2e,
    ItemPF2e,
    LootPF2e,
    MacroPF2e,
    SpellcastingEntryPF2e,
    SpellPF2e,
    TokenDocumentPF2e,
} from "foundry-pf2e";
import { MODULE } from "./module";

function isInstanceOf<T extends IsInstanceOfType>(obj: any, cls: T): obj is IsInstanceOfClasses[T];
function isInstanceOf<T>(obj: any, cls: string): obj is T;
function isInstanceOf(obj: any, cls: IsInstanceOfType | string) {
    if (typeof obj !== "object" || obj === null) return false;

    let cursor = Reflect.getPrototypeOf(obj);
    while (cursor) {
        if (cursor.constructor.name === cls) return true;
        cursor = Reflect.getPrototypeOf(cursor);
    }

    return false;
}

function getInMemory<T>(obj: object, ...path: string[]) {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`) as
        | T
        | undefined;
}

function setInMemory<T>(obj: object, ...args: [...string[], T]) {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}

function getInMemoryAndSetIfNot<T>(obj: object, ...args: [...string[], (() => T) | T]) {
    const value = args.pop() as T | (() => T);
    const current = getInMemory<T>(obj, ...(args as string[]));
    if (current != null) return current;

    const result = typeof value === "function" ? (value as Function)() : value;
    setInMemory(obj, ...(args as string[]), result);
    return result as T;
}

function deleteInMemory(obj: object, ...path: string[]) {
    const split = ["modules", MODULE.id, ...path.flatMap((x) => x.split("."))];
    const last = split.pop() as string;

    let cursor: any = obj;

    for (const key of split) {
        if (typeof cursor !== "object" || !(key in cursor)) return true;
        cursor = cursor[key];
    }

    return delete cursor[last];
}

type IsInstanceOfClasses = IsInstanceOfItems & {
    TokenDocumentPF2e: TokenDocumentPF2e;
    CreatureConfig: CreatureConfig<CreaturePF2e>;
    DamageRoll: DamageRoll;
    LootPF2e: LootPF2e;
    ActorPF2e: ActorPF2e;
    ChatMessagePF2e: ChatMessagePF2e;
    MacroPF2e: MacroPF2e;
};

type IsInstanceOfItems = {
    ItemPF2e: ItemPF2e;
    EffectPF2e: EffectPF2e;
    FeatPF2e: FeatPF2e;
    SpellPF2e: SpellPF2e;
    ConsumablePF2e: ConsumablePF2e;
    SpellcastingEntryPF2e: SpellcastingEntryPF2e;
};

type IsInstanceOfItem = keyof IsInstanceOfItems;
type IsInstanceOfType = keyof IsInstanceOfClasses;

export { deleteInMemory, getInMemory, getInMemoryAndSetIfNot, isInstanceOf, setInMemory };
export type { IsInstanceOfClasses, IsInstanceOfItem, IsInstanceOfItems, IsInstanceOfType };
