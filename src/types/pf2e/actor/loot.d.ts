import { LootPF2e, LootSheetPF2e } from "foundry-pf2e";

export {};

declare global {
    type LootSheetDataPF2e = Awaited<ReturnType<LootSheetPF2e<LootPF2e>["getData"]>>;
}
