import { BrowserTabs } from "foundry-pf2e";
declare function getCompendiumFilters<T extends keyof BrowserTabs>(tab: T): Promise<BrowserTabs[T]["filterData"]>;
export { getCompendiumFilters };
