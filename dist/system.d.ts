declare const SYSTEM: {
    readonly id: SystemId;
    readonly isPF2e: boolean;
    readonly isSF2e: boolean;
    path<T extends string>(tail: T): () => `systems/pf2e/${T}` | `systems/sf2e/${T}`;
    uuid<P extends DocumentUUID, S extends DocumentUUID = P>(pf2e: P, sf2e: S): () => P | S;
    getFlag<T_1 extends unknown>(obj: foundry.abstract.Document, ...path: string[]): T_1;
    getPack<T_2 extends JournalEntry | Playlist | RollTable | import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | import("foundry-pf2e").MacroPF2e | import("foundry-pf2e/pf2e/module/actor/base.js").ActorPF2e<null> | import("foundry-pf2e/pf2e/module/item/base/document.js").ItemPF2e<null>>(name: string): CompendiumCollection<T_2> | undefined;
    getPath<T_3 extends string>(tail: T_3): `systems/pf2e/${T_3}` | `systems/sf2e/${T_3}`;
};
export { SYSTEM };
