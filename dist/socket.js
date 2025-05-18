import { assignStyle, MODULE, R, sharedLocalize, userIsGM } from ".";
const EMITING_STYLE = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4em",
    textShadow: "0 0 6px #000000",
    color: "#e9e3e3",
    gap: "0.3em",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#00000094",
    padding: "0.3em 0.5em",
    borderRadius: "20px",
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
    return {
        get enabled() {
            return _enabled;
        },
        async call(options, userId) {
            if (!R.isPlainObject(options))
                return;
            if (game.user.isGM) {
                const callOptions = (await convertToCallOptions(options));
                return callback(callOptions, userId ?? game.userId);
            }
            else {
                if (!game.users.activeGM) {
                    ui.notifications.error(sharedLocalize("emiting.noGm"));
                    return;
                }
                displayEmiting();
                const packet = convertToEmitOptions(options);
                packet.__type__ = prefix;
                socketEmit(packet);
            }
        },
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
        if (!R.isString(value)) {
            callOptions[key] = value;
            return;
        }
        try {
            const parseResult = foundry.utils.parseUuid(value);
            if (parseResult?.documentId &&
                parseResult.type &&
                ["Item", "Actor", "Token"].includes(parseResult.type)) {
                callOptions[key] = await fromUuid(value);
            }
            else {
                callOptions[key] = value;
            }
        }
        catch {
            callOptions[key] = value;
        }
    }));
    return callOptions;
}
function convertToEmitOptions(options) {
    return R.mapValues(options, (value) => {
        return value instanceof foundry.abstract.Document ? value.uuid : value;
    });
}
export { createEmitable, socketEmit, socketOff, socketOn };
