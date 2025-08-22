import { isInstanceOf } from "./object";
function selectTokens(tokens) {
    canvas.tokens.releaseAll();
    for (const target of tokens) {
        const token = target instanceof TokenDocument ? target.object : target;
        token?.control({ releaseOthers: false });
    }
}
function positionTokenFromCoords({ x, y }, token, snapped = true) {
    let position = token.getCenterPoint({ x: 0, y: 0 });
    position.x = x - position.x;
    position.y = y - position.y;
    if (snapped) {
        position = token.getSnappedPosition(position);
    }
    return position;
}
async function pingToken(token, local) {
    if (!canvas.ready)
        return false;
    return ping(token.center, { local });
}
/**
 * slightly modified core foundry version
 */
async function ping(origin, options) {
    // Don't allow pinging outside of the canvas bounds
    if (!canvas.dimensions.rect.contains(origin.x, origin.y))
        return false;
    // Configure the ping to be dispatched
    const types = CONFIG.Canvas.pings.types;
    const isPull = game.keyboard.isModifierActive("Shift");
    const isAlert = game.keyboard.isModifierActive("Alt");
    let style = types.PULSE;
    if (isPull)
        style = types.PULL;
    else if (isAlert)
        style = types.ALERT;
    let ping = { scene: canvas.scene?.id, pull: isPull, style, zoom: canvas.stage.scale.x };
    ping = foundry.utils.mergeObject(ping, options);
    if (!options?.local) {
        // Broadcast the ping to other connected clients
        const activity = { cursor: origin, ping };
        game.user.broadcastActivity(activity);
    }
    // Display the ping locally
    return canvas.controls.handlePing(game.user, origin, ping);
}
function emitTokenHover(event, token, hover) {
    if (!canvas.ready)
        return;
    const tokenObj = isInstanceOf(token, "TokenPF2e") ? token : token.object;
    if (hover && tokenObj?.isVisible && !tokenObj.controlled) {
        tokenObj.emitHoverIn(event);
    }
    else if (!hover) {
        tokenObj?.emitHoverOut(event);
    }
}
function panToToken(token, control) {
    if (control) {
        const tokenObj = isInstanceOf(token, "TokenPF2e") ? token : token.object;
        tokenObj?.control({ releaseOthers: true });
    }
    canvas.animatePan(token.center);
}
function getFirstActiveToken(actor, { linked, scene } = {}) {
    const predicate = (token) => !linked || token.actorLink;
    return actor.token ?? getFirstTokenThatMatches(actor, predicate, scene);
}
function getFirstTokenThatMatches(actor, predicate, scene = game.scenes.current) {
    if (!scene)
        return null;
    for (const token of actor._dependentTokens.get(scene) ?? []) {
        if (predicate(token)) {
            return token;
        }
    }
    return null;
}
function hasTokenThatMatches(actor, predicate) {
    return !!getFirstTokenThatMatches(actor, predicate);
}
export { emitTokenHover, getFirstActiveToken, getFirstTokenThatMatches, hasTokenThatMatches, panToToken, pingToken, positionTokenFromCoords, selectTokens, };
