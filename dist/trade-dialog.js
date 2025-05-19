import { htmlQuery, R } from ".";
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/actor/sheet/popups/item-transfer-dialog.ts#L6
 */
class ItemTransferDialog extends FormApplication {
    #resolve = null;
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "ItemTransferDialog",
            classes: ["dialog", "item-transfer"],
            template: "systems/pf2e/templates/popups/item-transfer-dialog.hbs",
            width: "auto",
            height: "auto",
            newStack: false,
            lockStack: false,
        };
    }
    get title() {
        return this.options.title || game.i18n.localize("PF2E.loot.MoveLoot");
    }
    get item() {
        return this.object;
    }
    async getData() {
        const item = this.item;
        const prompt = this.options.prompt || game.i18n.localize("PF2E.loot.MoveLootMessage");
        return {
            ...(await super.getData()),
            item,
            quantity: item.quantity,
            newStack: this.options.newStack,
            lockStack: this.options.lockStack,
            canGift: false,
            prompt,
        };
    }
    /**
     * Shows the dialog and resolves how many to transfer and what action to perform.
     * In situations where there are no choices (quantity is 1 and its a player purchasing), this returns immediately.
     */
    async resolve() {
        this.render(true);
        return new Promise((resolve) => {
            this.#resolve = resolve;
        });
    }
    activateListeners($html) {
        super.activateListeners($html);
        const html = $html[0];
        const priceElement = htmlQuery(html, ".price");
        const quantityInput = htmlQuery(html, "input[name=quantity]");
        // If the price element exists, update it and listen for quantity changes
        if (priceElement) {
            const getQuantity = () => Math.clamp(Number(quantityInput?.value ?? 1), 1, this.item.quantity);
            const updatePrice = () => {
                const quantity = Math.clamp(Number(quantityInput?.value ?? 1), 1, this.item.quantity);
                const cost = game.pf2e.Coins.fromPrice(this.item.price, quantity);
                priceElement.innerText = `(${cost.toString()})`;
            };
            updatePrice();
            quantityInput?.addEventListener("input", () => {
                updatePrice();
            });
            quantityInput?.addEventListener("blur", () => {
                quantityInput.value = String(getQuantity());
                updatePrice();
            });
        }
    }
    async _renderInner(data, options) {
        const $html = await super._renderInner(data, options);
        if (this.options.button) {
            $html.find("button").text(this.options.button);
        }
        return $html;
    }
    async _updateObject(event, formData) {
        if (R.isNumber(formData.quantity) && formData.quantity > 0) {
            this.#resolve?.({
                quantity: formData.quantity,
                newStack: formData.newStack,
            });
        }
        else {
            this.#resolve?.(null);
        }
        this.#resolve = null;
    }
    async close(options) {
        this.#resolve?.(null);
        return super.close(options);
    }
}
export { ItemTransferDialog };
