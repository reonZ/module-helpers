import { TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
declare function userIsGM(user?: User): boolean;
declare function userIsActiveGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
declare function setControlled(targets: (TokenPF2e | TokenDocumentPF2e)[]): void;
declare function getActor(): import("foundry-pf2e/pf2e/module/actor/base.js").ActorPF2e<TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e> | null> | null;
export { getActor, hasGMOnline, setControlled, userIsActiveGM, userIsGM };
