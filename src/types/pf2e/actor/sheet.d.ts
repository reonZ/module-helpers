import { SheetInventory } from "foundry-pf2e";

export {};

declare global {
    type SheetItemList = SheetInventory["sections"][number];
}
