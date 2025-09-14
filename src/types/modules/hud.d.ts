import {
    AbilityItemPF2e,
    ActorPF2e,
    CreaturePF2e,
    FeatPF2e,
    MeleePF2e,
    WeaponPF2e,
} from "foundry-pf2e";

declare global {
    namespace hud {
        type StanceData = {
            effectUUID: DocumentUUID;
            img: ImageFilePath;
            item: FeatPF2e<CreaturePF2e> | AbilityItemPF2e<CreaturePF2e>;
            label: string;
            sourceUUID: ItemUUID;
        };

        interface Api {
            actions: {
                randomPick: () => Promise<Notification | undefined>;
                rollGroupPerception: () => Promise<Notification | undefined>;
                rollRecallKnowledge: (actor: CreaturePF2e) => Promise<void>;
                useResolve: (actor: Maybe<ActorPF2e>) => Promise<void>;
            };
            utils: {
                addStance: (
                    actor: CreaturePF2e,
                    sourceUUID: DocumentUUID,
                    createMessage?: boolean
                ) => Promise<void>;
                canUseStances: (actor: ActorPF2e) => boolean;
                editAvatar: (actor: ActorPF2e) => void;
                getNpcStrikeImage: (strike: {
                    item: WeaponPF2e | MeleePF2e;
                    slug: string;
                }) => ImageFilePath;
                getStances: (actor: CreaturePF2e) => hud.StanceData[] | undefined;
                toggleStance: (
                    actor: CreaturePF2e,
                    sourceUUID: DocumentUUID,
                    force?: boolean
                ) => Promise<void>;
            };
        }
    }
}
