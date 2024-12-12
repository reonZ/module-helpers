import { TokenDocumentPF2e } from "foundry-pf2e";
declare function scenesTokens({ skipLinked }?: ScenesTokensOptions): Generator<TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e>, void, unknown>;
declare function hasScenesTokenWith(condition: (token: TokenDocumentPF2e) => boolean, options?: ScenesTokensOptions): boolean;
type ScenesTokensOptions = {
    skipLinked?: boolean;
};
export { hasScenesTokenWith, scenesTokens };
