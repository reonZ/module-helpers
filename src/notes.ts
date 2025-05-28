import { Predicate, DegreeOfSuccessString, RuleElementPF2e, RawPredicate } from "foundry-pf2e";
import { UserVisibility } from "foundry-pf2e/pf2e/scripts/ui/user-visibility.js";
import { createHTMLElement } from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/notes.ts#L7
 */
class RollNotePF2e {
    /** The selector used to determine on which rolls the note will be shown for. */
    selector: string;
    /** An optional title for the note */
    title: string | null;
    /** The text content of this note. */
    text: string;
    /** If true, these dice are user-provided/custom. */
    predicate: Predicate;
    /** List of outcomes to show this note for; or all outcomes if none are specified */
    outcome: DegreeOfSuccessString[];
    /** An optional visibility restriction for the note */
    visibility: UserVisibility | null;
    /** The originating rule element of this modifier, if any: used to retrieve "parent" item roll options */
    rule: RuleElementPF2e | null;

    constructor(params: RollNoteParams) {
        this.selector = params.selector;
        this.title = params.title ?? null;
        this.text = params.text;
        this.predicate = new game.pf2e.Predicate(params.predicate ?? []);
        this.outcome = [...(params.outcome ?? [])];
        this.visibility = params.visibility ?? null;
        this.rule = params.rule ?? null;
    }

    /** Convert an array of notes to a UL element, or null if the array is empty. */
    static notesToHTML(notes: RollNotePF2e[]): HTMLUListElement | null {
        if (notes.length === 0) return null;
        return createHTMLElement("ul", {
            classes: ["notes"],
            content: [...notes.flatMap((n) => ["\n", n.toHTML()]), "\n"],
        });
    }

    toHTML(): HTMLLIElement {
        const element = createHTMLElement("li", {
            classes: ["roll-note"],
            dataset: {
                itemId: this.rule?.item.id,
                visibility: this.visibility,
            },
            content: game.i18n.localize(this.text),
        });

        // Remove wrapping elements, such as from item descriptions
        if (element.childNodes.length === 1 && element.firstChild instanceof HTMLElement) {
            element.innerHTML = element.firstChild.innerHTML;
        }

        if (this.title) {
            const strong = createHTMLElement("strong", { content: game.i18n.localize(this.title) });
            element.prepend(strong, " ");
        }

        return element;
    }

    clone(): RollNotePF2e {
        return new RollNotePF2e({ ...this.toObject(), rule: this.rule });
    }

    toObject(): RollNoteSource {
        return {
            selector: this.selector,
            title: this.title,
            text: this.text,
            predicate: this.predicate.toObject(),
            outcome: this.outcome,
            visibility: this.visibility,
        };
    }
}

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

export { RollNotePF2e };
