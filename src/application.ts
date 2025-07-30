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

type ActorSheetType = "ActorSheetPF2e" | "CharacterSheetPF2e" | "NPCSheetPF2e" | "LootSheetPF2e";

type ItemSheetType =
    | "AbilitySheetPF2e"
    | "ConsumableSheetPF2e"
    | "EquipmentSheetPF2e"
    | "FeatSheetPF2e"
    | "ItemSheetPF2e"
    | "SpellSheetPF2e";

export { renderActorSheets, renderCharacterSheets, renderItemSheets };
