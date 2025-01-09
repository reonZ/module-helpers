import { BrowserTabs, TraitData } from "foundry-pf2e";
declare function filterTraits(traits: string[], selected: TraitData["selected"], condition: TraitData["conjunction"]): boolean;
declare function getCompendiumFilters<T extends keyof BrowserTabs>(tab: T): Promise<BrowserTabs[T]["filterData"]>;
export { filterTraits, getCompendiumFilters };
