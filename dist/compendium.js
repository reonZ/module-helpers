function getCompendiumFilters(tab) {
    const compendiumTab = game.pf2e.compendiumBrowser.tabs[tab];
    return compendiumTab.getFilterData();
}
export { getCompendiumFilters };
