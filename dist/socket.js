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
        const callOptions = await convertToCallOptions(packet);
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
            if (game.user.isActiveGM) {
                return callback(options, game.userId);
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
    const __converter__ = options.__converter__;
    const __source__ = options.__source__;
    // @ts-expect-error
    delete options.__converter__;
    // @ts-expect-error
    delete options.__source__;
    // @ts-expect-error
    delete options.__type__;
    await Promise.all(R.entries(options).map(async () => { }));
    const converted = (__source__ === "array" ? [] : {});
    await Promise.all(R.entries(options).map(async ([key, value]) => {
        converted[key] = await convertToCallOption(value, __converter__[key]);
    }));
    return converted;
}
async function convertToCallOption(value, __converter__) {
    switch (__converter__) {
        case "document": {
            return fromUuid(value);
        }
        case "target": {
            return convertTargetFromPacket(value);
        }
        case "token": {
            const tokenDocument = await fromUuid(value);
            return tokenDocument?.object;
        }
        default: {
            return value;
        }
    }
}
async function convertTargetFromPacket(target) {
    const actor = await fromUuid(target.actor);
    if (!(actor instanceof Actor))
        return;
    return {
        actor,
        token: (target.token && (await fromUuid(target.token))) || undefined,
    };
}
function convertToEmitOptions(options) {
    const __converter__ = {};
    const convertedOptions = R.mapValues(options, (value, key) => {
        if (value instanceof foundry.abstract.Document) {
            __converter__[key] = "document";
            return value.uuid;
        }
        if (value instanceof foundry.canvas.placeables.Token) {
            __converter__[key] = "token";
            return value.document.uuid;
        }
        if (isValidTargetDocuments(value)) {
            __converter__[key] = "target";
            return {
                actor: value.actor.uuid,
                token: value.token?.uuid,
            };
        }
        return value;
    });
    convertedOptions.__converter__ = __converter__;
    convertedOptions.__source__ = R.isArray(options) ? "array" : "object";
    return convertedOptions;
}
export { convertTargetFromPacket, convertToCallOptions, convertToEmitOptions, createEmitable, displayEmiting, socketEmit, socketOff, socketOn, };
