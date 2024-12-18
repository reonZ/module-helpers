import { ActorPF2e, TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
declare function userIsGM(user?: User): boolean;
declare function userIsActiveGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
declare function setControlled(targets: (TokenPF2e | TokenDocumentPF2e)[]): void;
declare function getActor(): ActorPF2e<TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e> | null> | null;
declare function isPrimaryUpdater(actor: ActorPF2e): boolean;
export { getActor, hasGMOnline, isPrimaryUpdater, setControlled, userIsActiveGM, userIsGM };
