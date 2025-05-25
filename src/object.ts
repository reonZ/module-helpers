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
    TokenDocumentPF2e: TokenDocumentPF2e;
    CreatureConfig: CreatureConfig<CreaturePF2e>;
    DamageRoll: DamageRoll;
    LootPF2e: LootPF2e;
    ActorPF2e: ActorPF2e;
    ChatMessagePF2e: ChatMessagePF2e;
    MacroPF2e: MacroPF2e;
    ArithmeticExpression: ArithmeticExpression;
    Grouping: Grouping;
    ClientDocumentMixin: ClientDocument;
};

type IsInstanceOfItems = {
    ItemPF2e: ItemPF2e;
    EffectPF2e: EffectPF2e;
    FeatPF2e: FeatPF2e;
    SpellPF2e: SpellPF2e;
    ConsumablePF2e: ConsumablePF2e;
    SpellcastingEntryPF2e: SpellcastingEntryPF2e;
};

export { isInstanceOf };
