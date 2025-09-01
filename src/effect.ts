import {
    AbstractEffectPF2e,
    ActorPF2e,
    ConditionSlug,
    ConditionSource,
    DamageType,
    DurationData,
    EffectSource,
    GrantItemSource,
    PersistentSourceData,
    RuleElementSource,
} from "foundry-pf2e";

/**
 * https://github.com/foundryvtt/pf2e/blob/47da59a8af7865052ba711b772a694d54230bd09/src/module/system/damage/values.ts#L92
 */
const PERSISTENT_DAMAGE_IMAGES: Partial<Record<DamageType, ImageFilePath>> = {
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

function isEffectlessCondition({
    duration,
    unidentified,
}: {
    duration?: CustomEffectDuration;
    unidentified?: boolean;
}) {
    return (duration?.unit ?? "unlimited") === "unlimited" && !unidentified && !duration?.origin;
}

function createCustomPersistentDamage(
    options: CustomPersistentDamageOptions
): PreCreate<EffectSource | ConditionSource> | undefined {
    const { die: formula, type: damageType, dc } = options;

    if (isEffectlessCondition(options)) {
        return createPersistentDamageSource(formula, damageType, dc);
    }

    return createCustomCondition({
        ...options,
        slug: "persistent-damage",
        img: options.img || PERSISTENT_DAMAGE_IMAGES[options.type],
        alterations: [
            {
                mode: "override",
                property: "persistent-damage",
                value: { formula, damageType, dc } satisfies PersistentSourceData,
            },
        ],
    });
}

function createPersistentDamageSource(formula: string, damageType: DamageType, dc = 15) {
    const baseConditionSource =
        game.pf2e.ConditionManager.getCondition("persistent-damage").toObject();
    return foundry.utils.mergeObject(baseConditionSource, {
        system: { persistent: { formula, damageType, dc } },
    });
}

function createConditionSource(
    slug: ConditionSlug,
    counter = 1
): PreCreate<ConditionSource> | undefined {
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition) return;

    const source = condition.toObject();

    if (condition.system.value.isValued && counter > 1) {
        source.system.value.value = Math.max(counter, 1);
    }

    return source;
}

function createCustomCondition(
    options: CustomConditionOptions
): PreCreate<EffectSource> | undefined {
    const { alterations = [], counter = 1, img, name, slug } = options;
    const condition = game.pf2e.ConditionManager.conditions.get(slug);
    if (!condition) return;

    if (
        // we do not handle dying or unconcious condition+effect combo
        ["dying", "unconscious"].includes(slug) ||
        (slug === "persistent-damage" && !alterations.length)
    ) {
        return;
    }

    const rule: GrantItemSource & { alterations: Record<string, JSONValue>[] } = {
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
    });
}

function createCustomEffect({
    duration,
    img,
    name,
    rules,
    slug,
    unidentified,
}: CustomEffectOptions): PreCreate<EffectSource> {
    const system: DeepPartial<EffectSource["system"]> = {
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

type CustomPersistentDamageOptions = Omit<
    WithPartial<CustomEffectOptions, "name" | "img">,
    "slug"
> & {
    die: string;
    type: DamageType;
    dc: number;
};

type CustomConditionOptions = Omit<
    WithPartial<CustomEffectOptions, "img" | "name">,
    "rules" | "slug"
> & {
    slug: ConditionSlug;
    counter?: number;
    alterations?: Record<string, JSONValue>[];
};

type CustomEffectDuration = DurationData & {
    origin?: TargetDocuments;
};

type CustomEffectOptions = {
    duration?: CustomEffectDuration;
    img: ImageFilePath;
    name: string;
    rules?: RuleElementSource[];
    slug?: string;
    unidentified?: boolean;
};

interface EffectsPanelViewData {
    afflictions: EffectViewData[];
    conditions: EffectViewData[];
    effects: EffectViewData[];
    actor: ActorPF2e | null;
    user: { isGM: boolean };
}

interface EffectViewData {
    effect: AbstractEffectPF2e;
    description: string;
    remaining: string | null;
}

export {
    createConditionSource,
    createCustomCondition,
    createCustomEffect,
    createCustomPersistentDamage,
    isEffectlessCondition,
};
export type {
    CustomConditionOptions,
    CustomEffectDuration,
    CustomEffectOptions,
    EffectsPanelViewData,
};
