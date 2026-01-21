declare const SYSTEM: {
    readonly id: "pf2e" | "sf2e";
    readonly isPF2e: boolean;
    readonly isSF2e: boolean;
    path<T extends string>(tail: T): () => `systems/pf2e/${T}` | `systems/sf2e/${T}`;
};
export { SYSTEM };
