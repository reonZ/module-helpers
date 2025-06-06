declare function renderCharacterSheets(): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
type ItemSheetType = "AbilitySheetPF2e" | "ConsumableSheetPF2e" | "EquipmentSheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "SpellSheetPF2e";
export { renderCharacterSheets, renderItemSheets };
