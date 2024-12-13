import { BrowserTabs, MultiselectData } from "foundry-pf2e";
declare function filterTraits(traits: string[], selected: MultiselectData["selected"], condition: MultiselectData["conjunction"]): boolean;
declare function getCompendiumFilters<T extends keyof BrowserTabs>(tab: T): Promise<BrowserTabs[T]["filterData"]>;
export { filterTraits, getCompendiumFilters };
