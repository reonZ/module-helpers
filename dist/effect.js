/**
 * https://github.com/foundryvtt/pf2e/blob/47da59a8af7865052ba711b772a694d54230bd09/src/module/system/damage/values.ts#L92
 */
const PERSISTENT_DAMAGE_IMAGES = {
    acid: "icons/magic/acid/dissolve-arm-flesh.webp",
    bludgeoning: "systems/pf2e/icons/equipment/weapons/bola.webp",
    cold: "icons/magic/water/ice-snowman.webp",
    electricity: "systems/pf2e/icons/spells/chain-lightning.webp",
    fire: "icons/magic/fire/flame-burning-creature-skeleton.webp",
    force: "systems/pf2e/icons/spells/magic-missile.webp",
    mental: "systems/pf2e/icons/spells/modify-memory.webp",
    piercing: "systems/pf2e/icons/equipment/weapons/throwing-knife.webp",
    poison: "systems/pf2e/icons/spells/acidic-burst.webp",
    slashing: "systems/pf2e/icons/equipment/weapons/scimitar.webp",
    sonic: "systems/pf2e/icons/spells/cry-of-destruction.webp",
    spirit: "icons/magic/unholy/hand-claw-fire-blue.webp",
    vitality: "systems/pf2e/icons/spells/moment-of-renewal.webp",
    void: "systems/pf2e/icons/spells/grim-tendrils.webp",
};
function createCustomPersistentDamage(options) {
    return createCustomCondition({
        ...options,
        slug: "persistent-damage",
        img: options.img || PERSISTENT_DAMAGE_IMAGES[options.type],
        alterations: [
            {
                mode: "override",
                property: "persistent-damage",
                value: {
                    formula: options.die,
                    damageType: options.type,
                    dc: options.dc,
                },
            },
        ],
    });
}
function createCustomCondition(options) {
    const { slug, duration, unidentified, counter = 1 } = options;
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition)
        return;
    const unit = duration?.unit ?? "unlimited";
    const isValued = condition.system.value.isValued && counter > 1;
    if (
    // we do not handle dying or unconcious condition+effect combo
    ["dying", "unconscious"].includes(slug) ||
        (unit === "unlimited" && !unidentified && !duration?.origin)) {
        const source = condition.toObject();
        if (isValued) {
            source.system.value.value = Math.max(counter, 1);
        }
        return source;
    }
    const rule = {
        key: "GrantItem",
        uuid: condition.uuid,
        onDeleteActions: {
            grantee: "restrict",
        },
        alterations: options.alterations ?? [],
    };
    if (isValued) {
        rule.inMemoryOnly = true;
        rule.alterations.push({
            mode: "override",
            property: "badge-value",
            value: counter,
        });
    }
    return createCustomEffect({
        ...options,
        name: options.name || `${game.i18n.localize("TYPES.Item.effect")}: ${condition.name}`,
        img: options.img || condition.img,
        rules: [rule],
    });
}
function createCustomEffect({ duration, img, name, rules, slug, unidentified, }) {
    const system = {
        unidentified,
        duration,
        tokenIcon: { show: false },
    };
    if (rules?.length) {
        system.rules = rules;
    }
    if (slug) {
        system.slug = slug;
    }
    if (duration?.origin) {
        const { actor, token } = duration.origin;
        system.context = {
            origin: {
                actor: actor.uuid,
                token: token?.uuid ?? actor.token?.uuid ?? null,
                item: null,
                spellcasting: null,
            },
            roll: null,
            target: null,
        };
    }
    return {
        type: "effect",
        name,
        img,
        system,
    };
}
export { createCustomCondition, createCustomEffect, createCustomPersistentDamage };
