import { TokenPF2e } from "foundry-pf2e";
declare function getDropTarget(_canvas: Canvas, data: DropCanvasData, filter?: (token: TokenPF2e) => boolean): TokenPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e>> | undefined;
export { getDropTarget };
