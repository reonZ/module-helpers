import { ChatMessagePF2e, DegreeOfSuccessString } from "foundry-pf2e";

declare global {
    interface SpellCastContextFlag {
        type: "spell-cast";
        domains: string[];
        options: string[];
        outcome?: DegreeOfSuccessString;
        /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
        rollMode?: RollMode;
    }

    type ChatMessagePF2eCreateData = ChatMessageCreateData<ChatMessagePF2e>;
}
