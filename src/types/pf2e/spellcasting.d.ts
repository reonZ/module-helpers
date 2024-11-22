import { SpellPF2e, SpellSlotGroupId } from "foundry-pf2e";

export {};

declare global {
    type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";

    interface WarnInvalidDropParams {
        spell: SpellPF2e;
        groupId?: Maybe<SpellSlotGroupId>;
    }
}
