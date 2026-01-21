import {
    DCOptions,
    IdentifyAlchemyDCs,
    IdentifyMagicDCs,
    MagicTradition,
    PhysicalItemPF2e,
    Rarity,
} from "foundry-pf2e";
import { adjustDCByRarity, calculateDC, MAGIC_TRADITIONS, R, setHasElement, SYSTEM } from ".";
import appv1 = foundry.appv1;

/**
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/item/identification.ts#L29
 */
function getDcRarity(item: PhysicalItemPF2e): Rarity {
    return item.traits.has("cursed") ? "unique" : item.rarity;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/item/identification.ts#L21
 */
function getMagicTraditions(item: PhysicalItemPF2e): Set<MagicTradition> {
    const traits: string[] = item.system.traits.value;
    return new Set(traits.filter((t): t is MagicTradition => setHasElement(MAGIC_TRADITIONS, t)));
}

/**
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/item/identification.ts#L36
 */
function getIdentifyMagicDCs(
    item: PhysicalItemPF2e,
    baseDC: number,
    notMatchingTraditionModifier: number,
): IdentifyMagicDCs {
    const result = {
        occult: baseDC,
        primal: baseDC,
        divine: baseDC,
        arcane: baseDC,
    };
    const traditions = getMagicTraditions(item);
    for (const key of MAGIC_TRADITIONS) {
        // once an item has a magic tradition, all skills
        // that don't match the tradition are hard
        if (traditions.size > 0 && !traditions.has(key)) {
            result[key] = baseDC + notMatchingTraditionModifier;
        }
    }
    return {
        arcana: result.arcane,
        nature: result.primal,
        religion: result.divine,
        occultism: result.occult,
    };
}

/**
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/item/identification.ts#L62
 * with option fallback
 */
function getItemIdentificationDCs(
    item: PhysicalItemPF2e,
    { pwol = false, notMatchingTraditionModifier }: IdentifyItemOptions = {
        pwol: game.pf2e.settings.variants.pwol.enabled,
        notMatchingTraditionModifier: game.settings.get(SYSTEM.id, "identifyMagicNotMatchingTraditionModifier"),
    },
): IdentifyMagicDCs | IdentifyAlchemyDCs {
    const baseDC = calculateDC(item.level, { pwol });
    const rarity = getDcRarity(item);
    const dc = adjustDCByRarity(baseDC, rarity);
    if (item.isMagical) {
        return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
    } else {
        return { crafting: dc };
    }
}

/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/actor/sheet/popups/identify-popup.ts#L7
 */
class IdentifyItemPopup extends appv1.api.FormApplication<PhysicalItemPF2e> {
    static override get defaultOptions(): FormApplicationOptions {
        return {
            ...super.defaultOptions,
            id: "identify-item",
            title: game.i18n.localize("PF2E.identification.Identify"),
            template: `systems/${SYSTEM.id}/templates/actors/identify-item.hbs`,
            width: "auto",
            classes: ["identify-popup"],
        };
    }

    dcs = getItemIdentificationDCs(this.object);

    override async getData(): Promise<IdentifyPopupData> {
        const item = this.object;
        return {
            ...(await super.getData()),
            isMagic: item.isMagical,
            isAlchemical: item.isAlchemical,
            dcs: this.dcs,
        };
    }

    // we extracted that part from activateListeners so it can be called from third party
    async postSkillChecks() {
        const item = this.object;
        const identifiedName = item.system.identification.identified.name;
        const dcs: Record<string, number> = this.dcs;
        const action = item.isMagical ? "identify-magic" : item.isAlchemical ? "identify-alchemy" : "recall-knowledge";

        const path = `systems/${SYSTEM.id}/templates/actors/identify-item-chat-skill-checks.hbs`;
        const content = await foundry.applications.handlebars.renderTemplate(path, {
            identifiedName,
            action,
            skills: R.omit(dcs, ["dc"]),
            unidentified: item.system.identification.unidentified,
            uuid: item.uuid,
        });

        await getDocumentClass("ChatMessage").create({ author: game.user.id, content });
    }

    override activateListeners($html: JQuery): void {
        const html = $html[0];

        const updateButton = html.querySelector<HTMLButtonElement>("button.update-identification");
        updateButton?.addEventListener("click", () => {
            this.submit({ updateData: { status: updateButton.value } });
        });

        // Add listener on Post skill checks to chat button that posts item unidentified img and name and skill checks
        html.querySelector("button.post-skill-checks")?.addEventListener("click", async () => {
            await this.postSkillChecks();
        });
    }

    protected override async _updateObject(_event: Event, formData: Record<string, unknown>): Promise<void> {
        const status = formData["status"];
        if (status === "identified") {
            return this.object.setIdentificationStatus(status);
        }
    }
}

interface IdentifyItemOptions extends DCOptions {
    notMatchingTraditionModifier: number;
}

interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: IdentifyMagicDCs | IdentifyAlchemyDCs;
}

export { IdentifyItemPopup, getItemIdentificationDCs };
