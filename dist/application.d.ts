declare function renderCharacterSheets(): void;
declare function renderActorSheets(type?: ActorSheetType | ActorSheetType[]): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
type ActorSheetType = "ActorSheetPF2e" | "CharacterSheetPF2e" | "NPCSheetPF2e" | "LootSheetPF2e";
type ItemSheetType = "AbilitySheetPF2e" | "ConsumableSheetPF2e" | "EquipmentSheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "SpellSheetPF2e";
export { renderActorSheets, renderCharacterSheets, renderItemSheets };
