import { DegreeOfSuccessString, RawPredicate, RuleElementPF2e } from "foundry-pf2e";
import { UserVisibility } from "foundry-pf2e/pf2e/scripts/ui/user-visibility.js";

export {};

declare global {
    interface RollNoteSource {
        selector: string;
        title?: string | null;
        text: string;
        predicate?: RawPredicate;
        outcome?: DegreeOfSuccessString[];
        visibility?: UserVisibility | null;
    }

    interface RollNoteParams extends RollNoteSource {
        rule?: RuleElementPF2e | null;
    }
}
