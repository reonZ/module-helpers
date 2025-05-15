function getWorldTime(): number {
    return game.settings.get("core", "time");
}

export { getWorldTime };
