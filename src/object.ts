import {
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
} from "foundry-pf2e";

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
    ConsumablePF2e: ConsumablePF2e;
    EffectPF2e: EffectPF2e;
    FeatPF2e: FeatPF2e;
    ItemPF2e: ItemPF2e;
    SpellcastingEntryPF2e: SpellcastingEntryPF2e;
    SpellPF2e: SpellPF2e;
};

type IsInstanceOfItem = keyof IsInstanceOfItems;

export { isInstanceOf };
export type { IsInstanceOfItem, IsInstanceOfItems };
