import { ActorPF2e, ScenePF2e, TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
import { PingOptions } from "foundry-pf2e/foundry/client/pixi/board.js";
import { R } from ".";
import { isInstanceOf } from "./object";

function selectTokens(tokens: (TokenPF2e | TokenDocumentPF2e)[]) {
    canvas.tokens.releaseAll();

    for (const target of tokens) {
        const token = target instanceof TokenDocument ? target.object : target;
        token?.control({ releaseOthers: false });
    }
}

function positionTokenFromCoords({ x, y }: Point, token: TokenPF2e, snapped = true): Point {
    let position = token.getCenterPoint({ x: 0, y: 0 });

    position.x = x - position.x;
    position.y = y - position.y;

    if (snapped) {
        position = token.getSnappedPosition(position);
    }

    return position;
}

async function pingToken(token: TokenPF2e | TokenDocumentPF2e, local?: boolean): Promise<boolean> {
    if (!canvas.ready) return false;
    return ping(token.center, { local });
}

/**
 * slightly modified core foundry version
 */
async function ping(origin: Point, options?: PingOptions & { local?: boolean }): Promise<boolean> {
    // Don't allow pinging outside of the canvas bounds
    if (!canvas.dimensions.rect.contains(origin.x, origin.y)) return false;
    // Configure the ping to be dispatched
    const types = CONFIG.Canvas.pings.types;
    const isPull = game.keyboard.isModifierActive("Shift");
    const isAlert = game.keyboard.isModifierActive("Alt");
    let style: string = types.PULSE;
    if (isPull) style = types.PULL;
    else if (isAlert) style = types.ALERT;
    let ping = { scene: canvas.scene?.id, pull: isPull, style, zoom: canvas.stage.scale.x };
    ping = foundry.utils.mergeObject(ping, options);

    if (!options?.local) {
        // Broadcast the ping to other connected clients
        const activity: ActivityData = { cursor: origin, ping };
        game.user.broadcastActivity(activity);
    }

    // Display the ping locally
    return canvas.controls.handlePing(game.user, origin, ping);
}

function emitTokenHover(event: MouseEvent, token: TokenPF2e | TokenDocumentPF2e, hover: boolean) {
    if (!canvas.ready) return;

    const tokenObj = isInstanceOf(token, "TokenPF2e") ? token : token.object;

    if (hover && tokenObj?.isVisible && !tokenObj.controlled) {
        tokenObj.emitHoverIn(event);
    } else if (!hover) {
        tokenObj?.emitHoverOut(event);
    }
}

function panToToken(token: TokenPF2e | TokenDocumentPF2e, control?: boolean) {
    if (control) {
        const tokenObj = isInstanceOf(token, "TokenPF2e") ? token : token.object;
        tokenObj?.control({ releaseOthers: true });
    }

    canvas.animatePan(token.center);
}

function getFirstActiveToken(actor: ActorPF2e, { linked, scene }: FirstActiveTokenOptions = {}) {
    const predicate = (token: TokenDocumentPF2e) => !linked || token.actorLink;
    return actor.token ?? getFirstTokenThatMatches(actor, predicate, scene);
}

function getFirstTokenThatMatches(
    actor: ActorPF2e,
    predicate: (token: TokenDocumentPF2e) => boolean,
    scene: Maybe<ScenePF2e> = game.scenes.current,
) {
    if (!scene) return null;

    for (const token of actor._dependentTokens.get(scene) ?? []) {
        if (predicate(token)) {
            return token;
        }
    }

    return null;
}

function hasTokenThatMatches(actor: ActorPF2e, predicate: (token: TokenDocumentPF2e) => boolean): boolean {
    return !!getFirstTokenThatMatches(actor, predicate);
}

function getTokenDocument(token: unknown): TokenDocumentPF2e | undefined {
    return token instanceof foundry.canvas.placeables.Token
        ? token.document
        : token instanceof TokenDocument
          ? token
          : undefined;
}

function getTargetToken(
    target: Maybe<TargetDocuments>,
    options?: FirstActiveTokenOptions,
): TokenDocumentPF2e | undefined {
    if (!target) return undefined;
    return target.token ?? target.actor.token ?? getFirstActiveToken(target.actor, options) ?? undefined;
}

function getTargetsTokensUUIDs(targets: TargetDocuments[]): TokenDocumentUUID[] {
    return R.pipe(
        targets,
        R.map((target) => getTargetToken(target)?.uuid),
        R.filter(R.isTruthy),
    );
}

type FirstActiveTokenOptions = {
    linked?: boolean;
    scene?: ScenePF2e | null;
};

export {
    emitTokenHover,
    getFirstActiveToken,
    getFirstTokenThatMatches,
    getTargetToken,
    getTargetsTokensUUIDs,
    getTokenDocument,
    hasTokenThatMatches,
    panToToken,
    pingToken,
    positionTokenFromCoords,
    selectTokens,
};
