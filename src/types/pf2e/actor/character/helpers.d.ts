import { CharacterPF2e, WeaponPF2e, ZeroToTwo } from "foundry-pf2e";

export {};

declare global {
    interface AuxiliaryInteractParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "interact";
        annotation: "draw" | "grip" | "modular" | "pick-up" | "retrieve" | "sheathe";
        hands?: ZeroToTwo;
    }

    interface AuxiliaryShieldParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "end-cover" | "raise-a-shield" | "take-cover";
        annotation?: "tower-shield";
        hands?: never;
    }

    interface AuxiliaryReleaseParams {
        weapon: WeaponPF2e<CharacterPF2e>;
        action: "release";
        annotation: "grip" | "drop";
        hands: 0 | 1;
    }

    type AuxiliaryActionParams =
        | AuxiliaryInteractParams
        | AuxiliaryShieldParams
        | AuxiliaryReleaseParams;
    type AuxiliaryActionType = AuxiliaryActionParams["action"];
    type AuxiliaryActionPurpose = AuxiliaryActionParams["annotation"];
}
