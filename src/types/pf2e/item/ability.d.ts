import { AbilitySheetPF2e } from "foundry-pf2e";

export {};

declare global {
    type ActionSheetData = Awaited<ReturnType<AbilitySheetPF2e["getData"]>>;
}
