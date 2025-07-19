import { AbilityItemPF2e, ActorPF2e, CreaturePF2e, FeatPF2e } from "foundry-pf2e";

declare global {
    interface HudApi {
        addStance: (
            actor: CreaturePF2e,
            sourceUUID: DocumentUUID,
            createMessage?: boolean
        ) => Promise<void>;
        canUseStances: (actor: ActorPF2e) => boolean;
        getStances: (actor: CreaturePF2e) => hud.StanceData[] | undefined;
    }

    namespace hud {
        type StanceData = {
            effectUUID: DocumentUUID;
            img: ImageFilePath;
            item: FeatPF2e<CreaturePF2e> | AbilityItemPF2e<CreaturePF2e>;
            label: string;
            sourceUUID: ItemUUID;
        };
    }
}
