import * as R from "remeda";
import { error, hasGMOnline } from ".";
import { MODULE } from "./module";
function socketOn(callback) {
    game.socket.on(`module.${MODULE.id}`, callback);
}
function socketOff(callback) {
    game.socket.off(`module.${MODULE.id}`, callback);
}
function socketEmit(packet) {
    game.socket.emit(`module.${MODULE.id}`, packet);
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
            const packetOptions = R.mapValues(options, (entry) => entry instanceof foundry.abstract.Document ? entry.uuid : entry);
            socket?.emit({ ...packetOptions, type: packetType });
        }
    };
}
export { createCallOrEmit, socketEmit, socketOff, socketOn };
