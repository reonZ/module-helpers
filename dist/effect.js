function createPersistentDamageSource(formula, damageType, dc = 15) {
    const baseConditionSource = game.pf2e.ConditionManager.getCondition("persistent-damage").toObject();
    return foundry.utils.mergeObject(baseConditionSource, {
        system: { persistent: { formula, damageType, dc } },
    });
}
function createConditionSource(slug, counter = 1) {
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition)
        return;
    const source = condition.toObject();
    if (condition.system.value.isValued && counter > 1) {
        source.system.value.value = Math.max(counter, 1);
    }
    return source;
}
function createCustomCondition(options) {
    const { alterations = [], counter = 1, img, name, slug } = options;
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition)
        return;
    if (
    // we do not handle dying or unconcious condition+effect combo
    ["dying", "unconscious"].includes(slug) ||
        (slug === "persistent-damage" && !alterations.length)) {
        return;
    }
    const rule = {
        key: "GrantItem",
        uuid: condition.uuid,
        onDeleteActions: {
            grantee: "restrict",
        },
        alterations,
    };
    if (condition.system.value.isValued && counter > 1) {
        rule.inMemoryOnly = true;
        rule.alterations.push({
            mode: "override",
            property: "badge-value",
            value: counter,
        });
    }
    return createCustomEffect({
        ...options,
        name: name || `${game.i18n.localize("TYPES.Item.effect")}: ${condition.name}`,
        img: img || condition.img,
        rules: [rule],
        show: false,
    });
}
function createCustomEffect({ badge, duration, img, itemSlug, name, rules, show, unidentified, }) {
    const system = {
        unidentified,
        duration,
        tokenIcon: { show },
    };
    if (rules?.length) {
        system.rules = rules;
    }
    if (itemSlug) {
        system.slug = itemSlug;
    }
    if (badge) {
        system.badge = badge;
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
export { createConditionSource, createCustomCondition, createCustomEffect, createPersistentDamageSource };
