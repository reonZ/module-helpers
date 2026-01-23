declare const SYSTEM: {
    readonly id: SystemId;
    readonly isPF2e: boolean;
    readonly isSF2e: boolean;
    path<T extends string>(tail: T): () => `systems/pf2e/${T}` | `systems/sf2e/${T}`;
    uuid<P extends `Compendium.${string}.Actor.${string}` | `Compendium.${string}.Cards.${string}` | `Compendium.${string}.Item.${string}` | `Compendium.${string}.JournalEntry.${string}` | `Compendium.${string}.Macro.${string}` | `Compendium.${string}.Playlist.${string}` | `Compendium.${string}.RollTable.${string}` | `Compendium.${string}.Scene.${string}` | `Compendium.${string}.Adventure.${string}`, S extends `Compendium.${string}.Actor.${string}` | `Compendium.${string}.Cards.${string}` | `Compendium.${string}.Item.${string}` | `Compendium.${string}.JournalEntry.${string}` | `Compendium.${string}.Macro.${string}` | `Compendium.${string}.Playlist.${string}` | `Compendium.${string}.RollTable.${string}` | `Compendium.${string}.Scene.${string}` | `Compendium.${string}.Adventure.${string}`>(pf2e: P, sf2e: S): () => P | S;
    getFlag(obj: foundry.abstract.Document, ...path: string[]): unknown;
    getPack<T_1 extends JournalEntry | Playlist | RollTable | import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | import("foundry-pf2e").MacroPF2e | import("foundry-pf2e/pf2e/module/actor/base.js").ActorPF2e<null> | import("foundry-pf2e/pf2e/module/item/base/document.js").ItemPF2e<null>>(name: string): CompendiumCollection<T_1> | undefined;
    getPath<T_2 extends string>(tail: T_2): `systems/pf2e/${T_2}` | `systems/sf2e/${T_2}`;
};
export { SYSTEM };
