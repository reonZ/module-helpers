import { assignStyle, isValidTargetDocuments, MODULE, R, sharedLocalize, userIsGM } from ".";
const EMITING_STYLE = {
    alignItems: "center",
    background: "linear-gradient(90deg, #00000000 0%, #0000001a 20%, #00000066 50%, #0000001a 80%, #00000000 100%)",
    color: "#efe6d8c9",
    display: "flex",
    fontSize: "4em",
    gap: "0.3em",
    justifyContent: "center",
    left: "0",
    paddingBlock: "0.1em",
    position: "absolute",
    right: "0",
    textShadow: "#000000 0px 0px 6px",
    top: "10%",
    zIndex: "2147483647",
};
function socketOn(callback) {
    game.socket.on(`module.${MODULE.id}`, callback);
}
function socketOff(callback) {
    game.socket.off(`module.${MODULE.id}`, callback);
}
function socketEmit(packet) {
    game.socket.emit(`module.${MODULE.id}`, packet);
}
let _emitingElement;
function displayEmiting() {
    const emitingElement = (_emitingElement ??= (() => {
        const label = sharedLocalize("emiting.label");
        const el = document.createElement("div");
        el.innerHTML = `${label}<i class="fa-solid fa-wifi"></i>`;
        assignStyle(el, EMITING_STYLE);
        return el;
    })());
    document.body.append(emitingElement);
    setTimeout(() => {
        emitingElement.remove();
    }, 600);
}
function createEmitable(prefix, callback) {
    let _enabled = false;
    const onSocket = async (packet, userId) => {
        if (packet.__type__ !== prefix || !game.user.isActiveGM)
            return;
        delete packet.__type__;
        const callOptions = (await convertToCallOptions(packet));
        callback(callOptions, userId);
    };
    const emit = (options) => {
        if (!game.users.activeGM) {
            ui.notifications.error(sharedLocalize("emiting.noGm"));
            return;
        }
        displayEmiting();
        const packet = convertToEmitOptions(options);
        packet.__type__ = prefix;
        socketEmit(packet);
    };
    return {
        get enabled() {
            return _enabled;
        },
        async call(options) {
            if (!R.isPlainObject(options))
                return;
            if (game.user.isGM) {
                const callOptions = (await convertToCallOptions(options));
                return callback(callOptions, game.userId);
            }
            else {
                emit(options);
            }
        },
        emit,
        activate() {
            if (this.enabled || !userIsGM())
                return;
            _enabled = true;
            socketOn(onSocket);
        },
        disable() {
            if (!this.enabled)
                return;
            _enabled = false;
            socketOff(onSocket);
        },
        toggle(enabled) {
            enabled ??= !this.enabled;
            if (enabled) {
                this.activate();
            }
            else {
                this.disable();
            }
        },
    };
}
async function convertToCallOptions(options) {
    const callOptions = {};
    await Promise.all(R.entries(options).map(async ([key, value]) => {
        callOptions[key] = await convertToCallOption(value);
    }));
    return callOptions;
}
function convertToCallOption(value) {
    if (!R.isString(value)) {
        return value;
    }
    try {
        const parseResult = foundry.utils.parseUuid(value);
        if (parseResult?.documentId && parseResult.type && parseResult.type in foundry.documents) {
            return fromUuid(value);
        }
        else {
            value;
        }
    }
    catch {
        value;
    }
}
function convertToEmitOptions(options) {
    return R.mapValues(options, convertToEmitOption);
}
function convertToEmitOption(value) {
    if (value instanceof foundry.abstract.Document) {
        return value.uuid;
    }
    if (value instanceof Token) {
        return value.document.uuid;
    }
    if (isValidTargetDocuments(value)) {
        return {
            actor: value.actor.uuid,
            token: value.token?.uuid,
        };
    }
    return value;
}
export { convertToCallOption, convertToEmitOption, createEmitable, displayEmiting, socketEmit, socketOff, socketOn, };
