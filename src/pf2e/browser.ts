import { BrowserTabs, TraitData } from "foundry-pf2e";

function filterTraits(
    traits: string[],
    selected: TraitData["selected"],
    condition: TraitData["conjunction"]
): boolean {
    const selectedTraits = selected.filter((s) => !s.not).map((s) => s.value);
    const notTraits = selected.filter((t) => t.not).map((s) => s.value);
    if (notTraits.some((t) => traits.includes(t))) {
        return false;
    }
    if (selectedTraits.length) {
        return condition === "and"
            ? selectedTraits.every((t) => traits.includes(t))
            : selectedTraits.some((t) => traits.includes(t));
    }
    return true;
}

function getCompendiumFilters<T extends keyof BrowserTabs>(
    tab: T
): Promise<BrowserTabs[T]["filterData"]> {
    const compendiumTab = game.pf2e.compendiumBrowser.tabs[tab];
    return compendiumTab.getFilterData();
}

export { filterTraits, getCompendiumFilters };
