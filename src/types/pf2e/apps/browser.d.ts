import { CompendiumBrowser } from "foundry-pf2e";

declare global {
    type CompendiumBrowserSheetData = Awaited<ReturnType<CompendiumBrowser["getData"]>>;
}
