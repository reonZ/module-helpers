function createCustomCondition(options) {
    const { slug, duration, unidentified, origin, counter = 1 } = options;
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition)
        return;
    const unit = duration?.unit ?? "unlimited";
    const isValued = condition.system.value.isValued && counter > 1;
    if (
    // we do not handle dying or unconcious condition+effect combo
    ["dying", "unconscious"].includes(slug) ||
        (unit === "unlimited" && !unidentified && !origin)) {
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
    };
    if (isValued) {
        rule.inMemoryOnly = true;
        rule.alterations = [
            {
                mode: "override",
                property: "badge-value",
                value: counter,
            },
        ];
    }
    const prefix = game.i18n.localize("TYPES.Item.effect");
    const effectOptions = {
        ...options,
        name: options.name || `${prefix}: ${condition.name}`,
        img: options.img || condition.img,
        rules: [rule],
    };
    return createCustomEffect(effectOptions);
}
function createCustomEffect({ duration, img, name, origin, rules, slug, unidentified, }) {
    const system = {
        unidentified,
        duration,
    };
    if (rules?.length) {
        system.rules = rules;
    }
    if (slug) {
        system.slug = slug;
    }
    if (origin) {
        system.context = {
            origin: {
                actor: origin.actor.uuid,
                token: origin.token?.uuid ?? origin.actor.token?.uuid ?? null,
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
export { createCustomCondition, createCustomEffect };
