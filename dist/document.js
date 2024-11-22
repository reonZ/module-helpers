function resolveTarget(target) {
    if (!target)
        return;
    const actor = target.actor;
    const token = target.token ??
        ((game.toolbelt?.getToolSetting("targetHelper", "enabled") &&
            target.actor.getActiveTokens(true, true).at(0)) ||
            undefined);
    return { actor, token };
}
export { resolveTarget };
