import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { LocalizeArgs } from ".";
declare function setApplicationTitle(options: DeepPartial<ApplicationConfiguration>, ...args: LocalizeArgs): void;
declare function renderCharacterSheets(): void;
declare function renderItemSheets(type?: ItemSheetType | ItemSheetType[]): void;
type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e" | "SpellSheetPF2e";
export { renderCharacterSheets, renderItemSheets, setApplicationTitle };
