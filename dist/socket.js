import * as R from "remeda";
import { error, hasGMOnline, localizeIfExist } from ".";
import { MODULE } from "./module";
const SENDING_STYLE = {
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
let _sendingElement;
function displaySending() {
    const sendingElement = (_sendingElement ??= (() => {
        const label = localizeIfExist("SHARED.sending") || "Sending";
        const el = document.createElement("div");
        el.innerHTML = `${label}<i class="fa-solid fa-wifi"></i>`;
        Object.assign(el.style, SENDING_STYLE);
        return el;
    })());
    document.body.append(sendingElement);
    setTimeout(() => {
        sendingElement.remove();
    }, 500);
}
function createCallOrEmit(packetType, callback, socket) {
    return async (options, userId) => {
        if (!R.isObjectType(options))
            return;
        if (game.user.isGM) {
            const callbackOptions = {
                type: packetType,
            };
            await Promise.all(Object.entries(options).map(async ([key, entry]) => {
                if (entry instanceof foundry.abstract.Document || !R.isString(entry)) {
                    callbackOptions[key] = entry;
                    return;
                }
                try {
                    const parseResult = foundry.utils.parseUuid(entry);
                    if (["Item", "Actor"].includes(parseResult.type ?? "") && parseResult.id) {
                        callbackOptions[key] = await fromUuid(entry);
                    }
                    else {
                        callbackOptions[key] = entry;
                    }
                }
                catch {
                    callbackOptions[key] = entry;
                }
            }));
            callback(callbackOptions, userId ?? game.user.id);
        }
        else {
            if (!hasGMOnline()) {
                error("A GM must be online in order to enact this request.");
                return;
            }
            displaySending();
            const packetOptions = R.mapValues(options, (entry) => entry instanceof foundry.abstract.Document ? entry.uuid : entry);
            socket?.emit({ ...packetOptions, type: packetType });
        }
    };
}
export { createCallOrEmit, socketEmit, socketOff, socketOn };
