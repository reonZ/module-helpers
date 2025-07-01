import { ActorPF2e, TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
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

async function pingToken(token: TokenPF2e | TokenDocumentPF2e): Promise<boolean> {
    if (!canvas.ready) return false;
    return canvas.ping(token.center);
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

function getFirstActiveToken(actor: ActorPF2e) {
    return getFirstTokenThatMatches(actor, () => true);
}

function getFirstTokenThatMatches(
    actor: ActorPF2e,
    predicate: (token: TokenDocumentPF2e) => boolean
) {
    const scene = game.scenes.current;
    if (!scene) return null;

    for (const token of actor._dependentTokens.get(scene) ?? []) {
        if (predicate(token)) {
            return token;
        }
    }

    return null;
}

function hasTokenThatMatches(
    actor: ActorPF2e,
    predicate: (token: TokenDocumentPF2e) => boolean
): boolean {
    return !!getFirstTokenThatMatches(actor, predicate);
}

export {
    emitTokenHover,
    getFirstActiveToken,
    getFirstTokenThatMatches,
    hasTokenThatMatches,
    panToToken,
    pingToken,
    positionTokenFromCoords,
    selectTokens,
};
