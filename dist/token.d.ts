import { TokenPF2e } from "foundry-pf2e";
declare function selectTokens(tokens: TokenPF2e[]): void;
declare function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e, snapped?: boolean): Point;
export { positionTokenFromCoords, selectTokens };
