const SYSTEM = {
    get id() {
        return game.system.id;
    },
    get isPF2e() {
        return this.id === "pf2e";
    },
    get isSF2e() {
        return this.id === "sf2e";
    },
    path(tail) {
        return () => this.getPath(tail);
    },
    uuid(pf2e, sf2e) {
        return () => {
            return this.isSF2e ? sf2e : pf2e;
        };
    },
    getPack(name) {
        return game.packs.get(`${SYSTEM.id}.${name}`);
    },
    getPath(tail) {
        return `systems/${this.id}/${tail}`;
    },
};
export { SYSTEM };
