import { ActorPF2e, TokenDocumentPF2e, TokenPF2e } from "foundry-pf2e";
import * as R from "remeda";

function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.userId);
}

function userIsGM(user: User = getCurrentUser()) {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

function userIsActiveGM(user: User = getCurrentUser()) {
    return user === game.users.activeGM;
}

function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}

function setControlled(targets: (TokenPF2e | TokenDocumentPF2e)[]) {
    canvas.tokens.releaseAll();

    for (const target of targets) {
        const token = target instanceof TokenDocument ? target.object : target;
        token?.control({ releaseOthers: false });
    }
}

function getActor() {
    return R.only(canvas.tokens.controlled)?.actor ?? game.user.character;
}

function isPrimaryUpdater(actor: ActorPF2e) {
    return actor.primaryUpdater === game.user;
}

export { getActor, hasGMOnline, isPrimaryUpdater, setControlled, userIsActiveGM, userIsGM };
