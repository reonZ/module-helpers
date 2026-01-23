declare const SYSTEM: {
    readonly id: SystemId;
    readonly isPF2e: boolean;
    readonly isSF2e: boolean;
    path<T extends string>(tail: T): () => `systems/pf2e/${T}` | `systems/sf2e/${T}`;
    uuid<P extends `Compendium.${string}.Actor.${string}` | `Compendium.${string}.Cards.${string}` | `Compendium.${string}.Item.${string}` | `Compendium.${string}.JournalEntry.${string}` | `Compendium.${string}.Macro.${string}` | `Compendium.${string}.Playlist.${string}` | `Compendium.${string}.RollTable.${string}` | `Compendium.${string}.Scene.${string}` | `Compendium.${string}.Adventure.${string}`, S extends `Compendium.${string}.Actor.${string}` | `Compendium.${string}.Cards.${string}` | `Compendium.${string}.Item.${string}` | `Compendium.${string}.JournalEntry.${string}` | `Compendium.${string}.Macro.${string}` | `Compendium.${string}.Playlist.${string}` | `Compendium.${string}.RollTable.${string}` | `Compendium.${string}.Scene.${string}` | `Compendium.${string}.Adventure.${string}`>(pf2e: P, sf2e: S): () => P | S;
    getPath<T_1 extends string>(tail: T_1): `systems/pf2e/${T_1}` | `systems/sf2e/${T_1}`;
};
export { SYSTEM };
