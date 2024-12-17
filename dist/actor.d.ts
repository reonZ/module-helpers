import { ActorPF2e, CharacterPF2e, ScenePF2e, TokenDocumentPF2e, TokenPF2e, UserPF2e, ValueAndMax } from "foundry-pf2e";
declare function getDispositionColor(actor?: ActorPF2e | null): Color;
declare function getAlliance(actor: ActorPF2e): "neutral" | "party" | "opposition";
declare function isPlayedActor<T extends ActorPF2e>(actor?: T | null): actor is T;
declare function getHighestName(actor: ActorPF2e): string;
declare function getOwner(actor: ActorPF2e, activeOnly?: boolean): UserPF2e | null;
declare function isOwner(actor: ActorPF2e): boolean;
declare function getFirstActiveToken(actor: ActorPF2e, linked: boolean, document: true, scene?: ScenePF2e): TokenDocumentPF2e | null;
declare function getFirstActiveToken(actor: ActorPF2e, linked?: boolean, document?: false, scene?: ScenePF2e): TokenPF2e | null;
declare function canObserveActor(actor: Maybe<ActorPF2e>, withParty?: boolean): boolean;
declare function isFriendActor(actor: ActorPF2e): boolean;
declare function getWorldActor<T extends ActorPF2e>(actor: T): T;
declare function getWorldActor<T extends ActorPF2e>(actor: Maybe<T>): T | null;
declare function getMythicOrHeroPoints(actor: CharacterPF2e): ValueAndMax & {
    name: "mythicPoints" | "heroPoints";
};
export { canObserveActor, getAlliance, getDispositionColor, getFirstActiveToken, getHighestName, getMythicOrHeroPoints, getOwner, getWorldActor, isFriendActor, isOwner, isPlayedActor, };
