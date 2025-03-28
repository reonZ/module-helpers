import { adjustDCByRarity, calculateDC } from "./dc";
import { setHasElement } from "./misc";
import { MAGIC_TRADITIONS } from "./spell";
import * as R from "remeda";
function getDcRarity(item) {
    return item.traits.has("cursed") ? "unique" : item.rarity;
}
function getMagicTraditions(item) {
    const traits = item.system.traits.value;
    return new Set(traits.filter((t) => setHasElement(MAGIC_TRADITIONS, t)));
}
function getIdentifyMagicDCs(item, baseDC, notMatchingTraditionModifier) {
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
 * small modification to always default to:
 * - pwol: game.pf2e.settings.variants.pwol.enabled
 * - notMatchingTraditionModifier: game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier")
 */
function getItemIdentificationDCs(item, { pwol = game.pf2e.settings.variants.pwol.enabled, notMatchingTraditionModifier = game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier"), } = {}) {
    const baseDC = calculateDC(item.level, { pwol });
    const rarity = getDcRarity(item);
    const dc = adjustDCByRarity(baseDC, rarity);
    if (item.isMagical) {
        return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
    }
    else {
        return { crafting: dc };
    }
}
class IdentifyItemPopup extends FormApplication {
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "identify-item",
            title: game.i18n.localize("PF2E.identification.Identify"),
            template: "systems/pf2e/templates/actors/identify-item.hbs",
            width: "auto",
            classes: ["identify-popup"],
        };
    }
    dcs = getItemIdentificationDCs(this.object);
    async getData() {
        const item = this.object;
        return {
            ...(await super.getData()),
            isMagic: item.isMagical,
            isAlchemical: item.isAlchemical,
            dcs: this.dcs,
        };
    }
    activateListeners($html) {
        const html = $html[0];
        const updateButton = html.querySelector("button.update-identification");
        updateButton?.addEventListener("click", () => {
            this.submit({ updateData: { status: updateButton.value } });
        });
        // Add listener on Post skill checks to chat button that posts item unidentified img and name and skill checks
        html.querySelector("button.post-skill-checks")?.addEventListener("click", async () => {
            await this.requestChecks();
        });
    }
    async requestChecks() {
        const item = this.object;
        const identifiedName = item.system.identification.identified.name;
        const dcs = this.dcs;
        const action = item.isMagical
            ? "identify-magic"
            : item.isAlchemical
                ? "identify-alchemy"
                : "recall-knowledge";
        const content = await renderTemplate("systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs", {
            identifiedName,
            action,
            skills: R.omit(dcs, ["dc"]),
            unidentified: item.system.identification.unidentified,
            uuid: item.uuid,
        });
        await getDocumentClass("ChatMessage").create({ author: game.user.id, content });
    }
    async _updateObject(_event, formData) {
        const status = formData["status"];
        if (status === "identified") {
            return this.object.setIdentificationStatus(status);
        }
    }
}
export { IdentifyItemPopup, getItemIdentificationDCs };
