import { ActorPF2e, ChatMessagePF2e, ConsumablePF2e, CreatureConfig, CreaturePF2e, DamageRoll, EffectPF2e, FeatPF2e, ItemPF2e, LootPF2e, MacroPF2e, SpellcastingEntryPF2e, SpellPF2e, TokenDocumentPF2e } from "foundry-pf2e";
declare function isInstanceOf<T extends IsInstanceOfType>(obj: any, cls: T): obj is IsInstanceOfClasses[T];
declare function isInstanceOf<T>(obj: any, cls: string): obj is T;
declare function getInMemory<T>(obj: object, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: object, ...args: [...string[], T]): boolean;
declare function getInMemoryAndSetIfNot<T>(obj: object, ...args: [...string[], (() => T) | T]): T;
declare function deleteInMemory(obj: object, ...path: string[]): boolean;
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
