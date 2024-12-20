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
} as const;

function socketOn<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.on(`module.${MODULE.id}`, callback);
}

function socketOff<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.off(`module.${MODULE.id}`, callback);
}

function socketEmit<T extends object = object>(packet: T) {
    game.socket.emit(`module.${MODULE.id}`, packet);
}

let _sendingElement: HTMLElement;
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
    }, 400);
}

function createCallOrEmit<
    TType extends string,
    TOptions extends Record<string, any>,
    TOptionsWithSocket = WithSocketOptions<TOptions>,
    TPacket = ExtractSocketOptions<TType, TOptions>
>(
    packetType: TType,
    callback: (options: TOptions, userId: string) => void,
    socket?: {
        emit: (packet: TPacket) => void;
    }
): (options: TOptionsWithSocket, userId?: string) => void {
    return async (options: TOptionsWithSocket, userId?: string) => {
        if (!R.isObjectType(options)) return;

        if (game.user.isGM) {
            const callbackOptions: Record<string, any> = {
                type: packetType,
            };

            await Promise.all(
                Object.entries(options).map(async ([key, entry]) => {
                    if (entry instanceof foundry.abstract.Document || !R.isString(entry)) {
                        callbackOptions[key] = entry;
                        return;
                    }

                    try {
                        const parseResult = foundry.utils.parseUuid(entry);
                        if (["Item", "Actor"].includes(parseResult.type ?? "") && parseResult.id) {
                            callbackOptions[key] = await fromUuid(entry);
                        } else {
                            callbackOptions[key] = entry;
                        }
                    } catch {
                        callbackOptions[key] = entry;
                    }
                })
            );

            callback(callbackOptions as TOptions, userId ?? game.user.id);
        } else {
            if (!hasGMOnline()) {
                error("A GM must be online in order to enact this request.");
                return;
            }

            displaySending();

            const packetOptions = R.mapValues(options, (entry) =>
                entry instanceof foundry.abstract.Document
                    ? entry.uuid
                    : entry instanceof Token
                    ? entry.document.uuid
                    : entry
            ) as TPacket;

            socket?.emit({ ...packetOptions, type: packetType } as TPacket);
        }
    };
}

type ExtractSocketOptions<
    TType extends string,
    TOptions extends Record<string, any>
> = ExtractSocketOptionsRequired<TOptions> &
    ExtractSocketOptionsPartial<TOptions> & { type: TType };

type ExtractSocketOptionsRequired<
    TOptions extends Record<string, any>,
    TRequired = RequiredFieldsOnly<TOptions>
> = TRequired extends Record<infer TKey, any>
    ? {
          [k in TKey]: TRequired[k] extends ClientDocument ? string : TRequired[k];
      }
    : never;

type ExtractSocketOptionsPartial<
    TOptions extends Record<string, any>,
    TPartial = PartialFieldsOnly<TOptions>
> = TPartial extends Partial<Record<infer TKey, any>>
    ? {
          [k in TKey]?: TPartial[k] extends ClientDocument | undefined ? string : TPartial[k];
      }
    : never;

type WithSocketOptions<TOptions extends Record<string, any>> = WithSocketOptionsRequired<TOptions> &
    WithSocketOptionsPartial<TOptions>;

type WithSocketOptionsRequired<
    TOptions extends Record<string, any>,
    TRequired = RequiredFieldsOnly<TOptions>
> = TRequired extends Record<infer TKey, any>
    ? {
          [k in TKey]: TRequired[k] extends ClientDocument ? TRequired[k] | string : TRequired[k];
      }
    : never;

type WithSocketOptionsPartial<
    TOptions extends Record<string, any>,
    TPartial = PartialFieldsOnly<TOptions>
> = TPartial extends Partial<Record<infer TKey, any>>
    ? {
          [k in TKey]?: TPartial[k] extends ClientDocument | undefined
              ? TPartial[k] | string
              : TPartial[k];
      }
    : never;

export { createCallOrEmit, socketEmit, socketOff, socketOn };
export type { ExtractSocketOptions };
