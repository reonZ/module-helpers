import { ActorType, ItemType } from "foundry-pf2e";
import { isInstanceOf, R } from ".";

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

function renderActorSheets(type: ActorSheetType | ActorSheetType[] = ["ActorSheetPF2e"]) {
    renderApplications(type);
}

function renderItemSheets(type: ItemSheetType | ItemSheetType[] = ["ItemSheetPF2e"]) {
    renderApplications(type);
}

type ActorSheetType = "ActorSheetPF2e" | `${Capitalize<ActorType>}SheetPF2e`;

type ItemSheetType =
    | "ItemSheetPF2e"
    | "AbilitySheetPF2e"
    | `${Capitalize<Exclude<ItemType, "action">>}SheetPF2e`;

export { renderActorSheets, renderCharacterSheets, renderItemSheets };
