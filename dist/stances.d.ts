import { AbilityItemPF2e, ActorPF2e, CreaturePF2e, FeatPF2e } from "foundry-pf2e";
declare function addStance(actor: CreaturePF2e, sourceUUID: DocumentUUID, createMessage?: boolean): Promise<void>;
declare function canUseStances(actor: ActorPF2e): boolean;
declare function getStances(actor: CreaturePF2e): StanceData[] | undefined;
declare function toggleStance(actor: CreaturePF2e, sourceUUID: DocumentUUID, force?: boolean): Promise<void>;
type StanceData = {
    effectUUID: DocumentUUID;
    img: ImageFilePath;
    item: FeatPF2e<CreaturePF2e> | AbilityItemPF2e<CreaturePF2e>;
    label: string;
    sourceUUID: ItemUUID;
};
export { addStance, canUseStances, getStances, toggleStance };
export type { StanceData };
