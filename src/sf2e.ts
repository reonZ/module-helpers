import {
    CharacterPF2e,
    EffectAreaShape,
    NPCAttackTrait,
    SpellArea,
    Statistic,
    WeaponPF2e,
} from "foundry-pf2e";
import { createSpellAreaLabel } from ".";

const MODULE_ID = "sf2e-anachronism";
const EXTRA_AREA_OPTIONS = ["damaging-effect", "area-damage", "area-effect"];

const grenadeReg = /Template\[burst\|distance:(?<distance>\d+)\]/;

/**
 * https://github.com/TikaelSol/sf2e-anachronism/blob/28ab37351cd4deb1f68f56ac6b6e42b7a3c373c5/module/actions/area-fire.mjs#L7C16-L7C37
 */
async function createAreaFireMessage(weapon: WeaponPF2e<CharacterPF2e>) {
    const actor = weapon.actor;
    const traits = weapon.system.traits.value as NPCAttackTraitSF2e[];
    const isGrenade = traits.some((t) => t === "grenade");
    const isArea = traits.some((t) => t.startsWith("area-")) || isGrenade;
    const key = isArea ? "AreaFire" : "AutoFire";
    const actionCost = isGrenade ? 1 : 2;

    const savingThrow = calculateSaveDC(weapon);
    const areaLabel = createSpellAreaLabel(calculateArea(weapon));
    const templatePath = `/modules/${MODULE_ID}/templates/area-fire-message.hbs`;
    const content = await foundry.applications.handlebars.renderTemplate(templatePath, {
        actor,
        item: {
            img: weapon.img,
            name: game.i18n.localize(`SF2E.Actions.${key}.Title`),
            traits: ["area", "attack"].map((t) => ({
                name: t,
                label: CONFIG.PF2E.actionTraits[t as keyof typeof CONFIG.PF2E.actionTraits],
                description:
                    CONFIG.PF2E.traitsDescriptions[
                        t as keyof typeof CONFIG.PF2E.traitsDescriptions
                    ],
            })),
            actionCost: actionCost,
            description: game.i18n.localize(`SF2E.Actions.${key}.Description`),
        },
        areaLabel,
        saveLabel: game.i18n.format("PF2E.SaveDCLabelBasic", {
            dc: savingThrow.dc.value,
            type: game.i18n.localize(CONFIG.PF2E.saves.reflex),
        }),
        saveBreakdown: savingThrow.dc.breakdown,
    });

    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content,
        flags: {
            pf2e: {
                origin: weapon.getOriginData(),
            },
            "sf2e-anachronism": {
                // Temporary module flag for identification.
                // We will need a new context type for actions that support aux actions
                type: "area-fire",
            },
        },
    });
}

/**
 * https://github.com/TikaelSol/sf2e-anachronism/blob/28ab37351cd4deb1f68f56ac6b6e42b7a3c373c5/module/actions/area-fire.mjs#L119C1-L143C2
 */
function calculateArea(weapon: WeaponPF2e<CharacterPF2e>): SpellArea {
    const traits = weapon.system.traits.value as NPCAttackTraitSF2e[];

    if (traits.some((t) => t === "grenade")) {
        const description = weapon.system.description.value;
        const areaMatch = description.match(grenadeReg);
        const value = Number(areaMatch?.groups?.distance ?? 5);
        return { type: "burst", value };
    }

    const isAutomatic = traits.includes("automatic");
    const area = isAutomatic
        ? "cone"
        : (traits.find((t) => t.startsWith("area-"))?.replace("area-", "") as EffectAreaShape);
    if (area?.startsWith("burst")) {
        const value = Number(/burst-(\d*)/.exec(area)?.[1]);
        return { type: "burst", value };
    } else {
        // Set the range based on the weapon's range increment.
        // If its automatic we halve the range and round to the nearest multiple of 5
        const weaponRange = weapon.system.range ?? 0;
        const range = isAutomatic
            ? Math.max(5, Math.floor(weaponRange / 2) - (Math.floor(weaponRange / 2) % 5))
            : weaponRange;
        return { type: area ?? "burst", value: range };
    }
}

/**
 * https://github.com/TikaelSol/sf2e-anachronism/blob/28ab37351cd4deb1f68f56ac6b6e42b7a3c373c5/module/actions/area-fire.mjs#L146C1-L152C2
 */
function calculateSaveDC(weapon: WeaponPF2e<CharacterPF2e>): Statistic<CharacterPF2e> {
    const ModifierPF2e = game.pf2e.Modifier;
    const actor = weapon.actor;
    const classDC = actor.getStatistic("class");
    const itemBonus = new ModifierPF2e({
        label: "Tracking Bonus",
        type: "item",
        modifier: weapon.flags.pf2e.attackItemBonus,
    });
    return classDC.extend({ modifiers: itemBonus.modifier ? [itemBonus] : [] });
}

function getExtraAuxiliaryAction(item: WeaponPF2e): { label: string; glyph: string } | undefined {
    if (!game.modules.get("sf2e-anachronism")?.active) return;

    const traits = item.system.traits.value as (NPCAttackTrait | "grenade" | "automatic")[];
    const isArea = traits.some((trait) => trait.startsWith("area-") || trait === "grenade");
    const isAutomatic = traits.includes("automatic");
    if (!isArea && !isAutomatic) return;

    return {
        glyph: traits.some((t) => t === "grenade") ? "1" : "2",
        label: game.i18n.localize(`SF2E.Actions.${isArea ? "AreaFire" : "AutoFire"}.Title`),
    };
}

type NPCAttackTraitSF2e = NPCAttackTrait | "grenade" | "automatic";

export { calculateSaveDC, createAreaFireMessage, EXTRA_AREA_OPTIONS, getExtraAuxiliaryAction };
