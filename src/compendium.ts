import { BrowserTabs } from "foundry-pf2e";

function getCompendiumFilters<T extends keyof BrowserTabs>(
    tab: T
): Promise<BrowserTabs[T]["filterData"]> {
    const compendiumTab = game.pf2e.compendiumBrowser.tabs[tab];
    return compendiumTab.getFilterData();
}

export { getCompendiumFilters };
