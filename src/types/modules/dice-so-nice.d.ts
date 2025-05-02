import { CheckRoll } from "foundry-pf2e";

export {};

declare global {
    class Dice3D {
        showForRoll(
            roll: Roll | Rolled<Roll>,
            user?: User,
            synchronize?: boolean,
            users?: (User | string)[],
            blind?: boolean,
            messageID?: string | null,
            speaker?: foundry.documents.ChatSpeakerData | null
        ): Promise<boolean>;
    }

    type Dice3DCheckRoll = Rolled<CheckRoll & { ghost?: boolean }>;

    class DiseSoNiceModule extends Module {}
}
