import { TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
declare function selectTokens(tokens: (TokenPF2e | TokenDocumentPF2e)[]): void;
declare function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e, snapped?: boolean): Point;
declare function pingToken(token: TokenPF2e | TokenDocumentPF2e): Promise<boolean>;
declare function emitTokenHover(event: MouseEvent, token: TokenPF2e | TokenDocumentPF2e, hover: boolean): void;
declare function panToToken(token: TokenPF2e | TokenDocumentPF2e, control?: boolean): void;
export { emitTokenHover, panToToken, pingToken, positionTokenFromCoords, selectTokens };
