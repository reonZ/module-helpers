import { actorItems, getItemSource, getItemWithSourceId } from "./item.js";
const REPLACERS = new Map([
    [
        "Compendium.pf2e.feats-srd.Item.nRjyyDulHnP5OewA", // gorilla pound
        {
            replace: "Compendium.pf2e.feats-srd.Item.DqD7htz8Sd1dh3BT", // gorilla stance
            effect: "Compendium.pf2e.feat-effects.Item.UZKIKLuwpQu47feK",
        },
    ],
]);
const EXTRAS = new Map([
    [
        "Compendium.pf2e.feats-srd.Item.xQuNswWB3eg1UM28", // cobra envenom
        {
            effect: "Compendium.pf2e.feat-effects.Item.2Qpt0CHuOMeL48rN",
        },
    ],
    [
        "Compendium.pf2e.feats-srd.Item.R7c4PyTNkZb0yvoT", // dread marshal
        {
            effect: "Compendium.pf2e.feat-effects.Item.qX62wJzDYtNxDbFv", // the stance aura
        },
    ],
    [
        "Compendium.pf2e.feats-srd.Item.bvOsJNeI0ewvQsFa", // inspiring marshal
        {
            effect: "Compendium.pf2e.feat-effects.Item.er5tvDNvpbcnlbHQ", // the stance aura
        },
    ],
]);
function canUseStances(actor) {
    return actor.getActiveTokens(true, true).some((token) => token.inCombat);
}
function isValidStance(stance) {
    return (stance.isOfType("feat", "action") &&
        stance.system.traits.value.includes("stance") &&
        !!stance.system.selfEffect?.uuid);
}
function getStances(actor) {
    const stances = [];
    const replaced = new Set();
    for (const item of actorItems(actor, ["action", "feat"])) {
        const uuid = item.sourceId;
        if (!uuid)
            continue;
        const replacer = REPLACERS.get(uuid);
        const extra = EXTRAS.get(uuid);
        if (!replacer && !extra && !isValidStance(item))
            continue;
        const effectUUID = replacer?.effect ?? extra?.effect ?? item.system.selfEffect.uuid;
        const effect = fromUuidSync(effectUUID);
        if (!effect)
            continue;
        if (replacer?.replace) {
            replaced.add(replacer.replace);
        }
        const existingEffect = getItemWithSourceId(actor, effectUUID, "effect");
        stances.push({
            name: (replacer && fromUuidSync(replacer.replace)?.name) ?? item.name,
            itemName: item.name,
            uuid,
            img: effect.img,
            effectUUID,
            effectID: existingEffect?.id,
            actionUUID: uuid,
            actionID: item.id,
        });
    }
    return stances.filter(({ uuid }) => !replaced.has(uuid));
}
function getStanceEffects(actor) {
    const stances = getStances(actor);
    return stances.filter((stance) => !!stance.effectID);
}
async function toggleStance(actor, effectUUID, force) {
    if (!force && !canUseStances(actor)) {
        return "no-combat";
    }
    const effects = getStanceEffects(actor);
    const effect = effects.find((stance) => stance.effectUUID === effectUUID);
    if (!effect) {
        await addStance(actor, effectUUID);
    }
    if (effects.length) {
        actor.deleteEmbeddedDocuments("Item", effects.map(({ effectID }) => effectID));
    }
}
async function addStance(actor, effectUUID) {
    const source = await getItemSource(effectUUID, "EffectPF2e");
    if (!source)
        return;
    foundry.utils.setProperty(source, "flags.core.sourceId", effectUUID);
    foundry.utils.setProperty(source, "_stats.compendiumSource", effectUUID);
    const [item] = await actor.createEmbeddedDocuments("Item", [source]);
    item?.toMessage();
}
export { addStance, canUseStances, getStanceEffects, getStances, isValidStance, toggleStance };
