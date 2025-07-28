/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="tooltipster" />
import { ActorPF2e, PhysicalItemPF2e } from "foundry-pf2e";
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/actor/sheet/popups/item-transfer-dialog.ts#L6
 */
declare class ItemTransferDialog extends FormApplication<PhysicalItemPF2e, MoveLootOptions> {
    #private;
    static get defaultOptions(): MoveLootOptions;
    get title(): string;
    get item(): PhysicalItemPF2e;
    getData(): Promise<PopupData>;
    /**
     * Shows the dialog and resolves how many to transfer and what action to perform.
     * In situations where there are no choices (quantity is 1 and its a player purchasing), this returns immediately.
     */
    resolve(): Promise<MoveLootFormData | null>;
    activateListeners($html: JQuery<HTMLElement>): void;
    protected _renderInner(data: FormApplicationData<PhysicalItemPF2e>, options: RenderOptions): Promise<JQuery>;
    _updateObject(event: SubmitEvent, formData: Record<string, unknown> & MoveLootFormData): Promise<void>;
    close(options?: {
        force?: boolean;
    }): Promise<void>;
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
    isPurchase: boolean;
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
