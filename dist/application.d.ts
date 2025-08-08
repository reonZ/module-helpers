import { ActorType, ItemType } from "foundry-pf2e";
declare function renderCharacterSheets(): void;
declare function renderActorSheets(type?: ActorSheetType | ActorSheetType[]): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
type ActorSheetType = "ActorSheetPF2e" | `${Capitalize<ActorType>}SheetPF2e`;
type ItemSheetType = "ItemSheetPF2e" | "AbilitySheetPF2e" | `${Capitalize<Exclude<ItemType, "action">>}SheetPF2e`;
export { renderActorSheets, renderCharacterSheets, renderItemSheets };
