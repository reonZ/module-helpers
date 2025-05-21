import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { isInstanceOf, localize, LocalizeArgs, R } from ".";

function setApplicationTitle(
    options: DeepPartial<ApplicationConfiguration>,
    ...args: LocalizeArgs
) {
    const title = localize(...args);
    foundry.utils.setProperty(options, "window.title", title);
}

function renderApplications(type: string | string[]) {
    const types = Array.isArray(type) ? type : [type];
    const apps = [...R.values(ui.windows), ...foundry.applications.instances.values()].filter(
        (app) => types.some((x) => isInstanceOf(app, x))
    );

    for (const app of apps) {
        app.render();
    }
}

function renderCharacterSheets() {
    renderApplications("CharacterSheetPF2e");
}

function renderItemSheets(type: ItemSheetType | ItemSheetType[] = ["ItemSheetPF2e"]) {
    renderApplications(type);
}

type ItemSheetType =
    | "AbilitySheetPF2e"
    | "ConsumableSheetPF2e"
    | "EquipmentSheetPF2e"
    | "FeatSheetPF2e"
    | "ItemSheetPF2e"
    | "SpellSheetPF2e";

export { renderCharacterSheets, renderItemSheets, setApplicationTitle };
