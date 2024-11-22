function extractNotes(rollNotes, selectors) {
    return selectors.flatMap((s) => (rollNotes[s] ?? []).map((n) => n.clone()));
}
async function extractEphemeralEffects({ affects, origin, target, item, domains, options, }) {
    if (!(origin && target))
        return [];
    const [effectsFrom, effectsTo] = affects === "target" ? [origin, target] : [target, origin];
    const fullOptions = [
        ...options,
        effectsFrom.getRollOptions(domains),
        effectsTo.getSelfRollOptions(affects),
    ].flat();
    const resolvables = item ? (item.isOfType("spell") ? { spell: item } : { weapon: item }) : {};
    return (await Promise.all(domains
        .flatMap((s) => effectsFrom.synthetics.ephemeralEffects[s]?.[affects] ?? [])
        .map((d) => d({ test: fullOptions, resolvables })))).flatMap((e) => e ?? []);
}
export { extractEphemeralEffects, extractNotes };
