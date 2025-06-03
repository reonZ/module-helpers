import { MeasuredTemplateDocumentPF2e, MeasuredTemplatePF2e, TokenPF2e } from "foundry-pf2e";
declare function getTemplateTokens(measuredTemplate: MeasuredTemplateDocumentPF2e | MeasuredTemplatePF2e, { collisionOrigin, collisionType, }?: {
    collisionOrigin?: PIXI.Point;
    collisionType?: "move";
}): TokenPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null>>[];
export { getTemplateTokens };
