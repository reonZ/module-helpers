import { ActorPF2e, PhysicalItemPF2e } from "foundry-pf2e";
import { htmlQuery, R } from ".";

/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/actor/sheet/popups/item-transfer-dialog.ts#L6
 */
class ItemTransferDialog extends FormApplication<PhysicalItemPF2e, MoveLootOptions> {
    #resolve: ((value: MoveLootFormData | null) => void) | null = null;

    static override get defaultOptions(): MoveLootOptions {
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

    override get title(): string {
        return this.options.title || game.i18n.localize("PF2E.loot.MoveLoot");
    }

    get item(): PhysicalItemPF2e {
        return this.object;
    }

    override async getData(): Promise<PopupData> {
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
    async resolve(): Promise<MoveLootFormData | null> {
        this.render(true);
        return new Promise((resolve) => {
            this.#resolve = resolve;
        });
    }

    override activateListeners($html: JQuery<HTMLElement>): void {
        super.activateListeners($html);
        const html = $html[0];

        const priceElement = htmlQuery(html, ".price");
        const quantityInput = htmlQuery<HTMLInputElement>(html, "input[name=quantity]");

        // If the price element exists, update it and listen for quantity changes
        if (priceElement) {
            const getQuantity = () =>
                Math.clamp(Number(quantityInput?.value ?? 1), 1, this.item.quantity);
            const updatePrice = () => {
                const quantity = Math.clamp(
                    Number(quantityInput?.value ?? 1),
                    1,
                    this.item.quantity
                );
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

    protected async _renderInner(
        data: FormApplicationData<PhysicalItemPF2e>,
        options: RenderOptions
    ): Promise<JQuery> {
        const $html = await super._renderInner(data, options);

        if (this.options.button) {
            $html.find("button").text(this.options.button);
        }

        return $html;
    }

    override async _updateObject(
        event: SubmitEvent,
        formData: Record<string, unknown> & MoveLootFormData
    ): Promise<void> {
        if (R.isNumber(formData.quantity) && formData.quantity > 0) {
            this.#resolve?.({
                quantity: formData.quantity,
                newStack: formData.newStack,
            });
        } else {
            this.#resolve?.(null);
        }

        this.#resolve = null;
    }

    override async close(options?: { force?: boolean }): Promise<void> {
        this.#resolve?.(null);
        return super.close(options);
    }
}

interface MoveLootOptions extends FormApplicationOptions {
    targetActor?: ActorPF2e;
    newStack: boolean;
    lockStack: boolean;
    prompt?: string;
    button?: string;
    isPurchase?: boolean;
}

interface MoveLootFormData {
    quantity: number;
    newStack: boolean;
}

interface PopupData extends FormApplicationData {
    item: PhysicalItemPF2e;
    quantity: number;
    canGift: boolean;
    newStack: boolean;
    lockStack: boolean;
    prompt: string;
}

export { ItemTransferDialog };
export type { MoveLootFormData };
