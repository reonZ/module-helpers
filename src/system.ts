import { GamePF2e } from "foundry-pf2e";

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
        return () => this.getPath(tail);
    },
    uuid<P extends CompendiumUUID, S extends CompendiumUUID>(pf2e: P, sf2e: S): () => P | S {
        return (): P | S => {
            return this.isSF2e ? sf2e : pf2e;
        };
    },
    getPack<T extends PackContent>(name: string): CompendiumCollection<T> | undefined {
        return game.packs.get(`${SYSTEM.id}.${name}`);
    },
    getPath<T extends string>(tail: T): `systems/${SystemId}/${T}` {
        return `systems/${this.id}/${tail}`;
    },
};

type PackCollection = GamePF2e["packs"] extends Collection<infer T> ? T : never;
type PackContent = PackCollection extends CompendiumCollection<infer T> ? T : never;

export { SYSTEM };
