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
        return () => {
            return `systems/${this.id}/${tail}`;
        };
    },
};
export { SYSTEM };
