const SYSTEM = {
    get id(): SystemId {
        return game.system.id as SystemId;
    },
    get isPF2e(): boolean {
        return this.id === "pf2e";
    },
    get isSF2e(): boolean {
        return this.id === "sf2e";
    },
    path<T extends string>(tail: T): () => `systems/${SystemId}/${T}` {
        return (): `systems/${SystemId}/${T}` => {
            return `systems/${this.id}/${tail}`;
        };
    },
    uuid<P extends CompendiumUUID, S extends CompendiumUUID>(pf2e: P, sf2e: S): () => P | S {
        return (): P | S => {
            return this.isSF2e ? sf2e : pf2e;
        };
    },
};

export { SYSTEM };
