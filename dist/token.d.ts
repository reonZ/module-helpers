import { ActorPF2e, ScenePF2e, TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
declare function selectTokens(tokens: (TokenPF2e | TokenDocumentPF2e)[]): void;
declare function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e, snapped?: boolean): Point;
declare function pingToken(token: TokenPF2e | TokenDocumentPF2e, local?: boolean): Promise<boolean>;
declare function emitTokenHover(event: MouseEvent, token: TokenPF2e | TokenDocumentPF2e, hover: boolean): void;
declare function panToToken(token: TokenPF2e | TokenDocumentPF2e, control?: boolean): void;
declare function getFirstActiveToken(actor: ActorPF2e, { linked, scene }?: {
    linked?: boolean;
    scene?: ScenePF2e | null;
}): TokenDocumentPF2e<ScenePF2e | null> | null;
declare function getFirstTokenThatMatches(actor: ActorPF2e, predicate: (token: TokenDocumentPF2e) => boolean, scene?: Maybe<ScenePF2e>): TokenDocumentPF2e<ScenePF2e | null> | null;
declare function hasTokenThatMatches(actor: ActorPF2e, predicate: (token: TokenDocumentPF2e) => boolean): boolean;
declare function getTokenDocument(token: unknown): TokenDocumentPF2e | undefined;
declare function getTargetToken(target: Maybe<TargetDocuments>): TokenDocumentPF2e | undefined;
declare function getTargetsTokensUUIDs(targets: TargetDocuments[]): TokenDocumentUUID[];
export { emitTokenHover, getFirstActiveToken, getFirstTokenThatMatches, getTargetToken, getTargetsTokensUUIDs, getTokenDocument, hasTokenThatMatches, panToToken, pingToken, positionTokenFromCoords, selectTokens, };
