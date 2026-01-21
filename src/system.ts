const SYSTEM = {
    get id(): "pf2e" | "sf2e" {
        return game.system.id as "pf2e" | "sf2e";
    },
    get isPF2e(): boolean {
        return this.id === "pf2e";
    },
    get isSF2e(): boolean {
        return this.id === "sf2e";
    },
};

export { SYSTEM };
