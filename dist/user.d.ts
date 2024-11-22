import { TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
declare function userIsGM(user?: User): boolean;
declare function userIsActiveGM(user?: User): boolean;
declare function hasGMOnline(): boolean;
declare function setControlled(targets: (TokenPF2e | TokenDocumentPF2e)[]): void;
export { hasGMOnline, setControlled, userIsActiveGM, userIsGM };
