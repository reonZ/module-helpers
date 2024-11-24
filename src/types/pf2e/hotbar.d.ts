export {};

declare global {
    type HotbarDropData = Partial<DropCanvasData> & {
        actorId?: string;
        actorUUID?: ActorUUID;
        slot?: number;
        skill?: string;
        skillName?: string;
        index?: number;
        itemType?: string;
        elementTrait?: string;
        pf2e?: {
            type: string;
            property: string;
            label: string;
        };
    };

    type RollOptionData = {
        label: string;
        domain: string;
        option: string;
    };
}
