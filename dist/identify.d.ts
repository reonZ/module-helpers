/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="tooltipster" />
import { IdentifyAlchemyDCs, IdentifyMagicDCs, PhysicalItemPF2e } from "foundry-pf2e";
import appv1 = foundry.appv1;
/**
 * https://github.com/foundryvtt/pf2e/blob/0191f1fdac24c3903a939757a315043d1fcbfa59/src/module/actor/sheet/popups/identify-popup.ts#L7
 */
declare class IdentifyItemPopup extends appv1.api.FormApplication<PhysicalItemPF2e> {
    static get defaultOptions(): FormApplicationOptions;
    dcs: IdentifyMagicDCs | IdentifyAlchemyDCs;
    getData(): Promise<IdentifyPopupData>;
    activateListeners($html: JQuery): void;
    protected _updateObject(_event: Event, formData: Record<string, unknown>): Promise<void>;
}
interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: IdentifyMagicDCs | IdentifyAlchemyDCs;
}
export { IdentifyItemPopup };
