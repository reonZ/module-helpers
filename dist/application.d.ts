import { ActorType, ItemType } from "foundry-pf2e";
declare function renderCharacterSheets(): void;
declare function renderActorSheets(type?: ActorSheetType | ActorSheetType[]): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
type ActorSheetType = "ActorSheetPF2e" | `${Capitalize<ActorType>}SheetPF2e`;
type ItemSheetType = "ItemSheetPF2e" | `${Capitalize<ItemType>}SheetPF2e`;
export { renderActorSheets, renderCharacterSheets, renderItemSheets };
