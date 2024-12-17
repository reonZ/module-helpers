import * as R from "remeda";
import { error, hasGMOnline } from ".";
import { MODULE } from "./module";

function socketOn<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.on(`module.${MODULE.id}`, callback);
}

function socketOff<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.off(`module.${MODULE.id}`, callback);
}

function socketEmit<T extends object = object>(packet: T) {
    game.socket.emit(`module.${MODULE.id}`, packet);
}

function createCallOrEmit<
    TType extends string,
    TOptions extends Record<string, any>,
    TOptionsWithSocket = WithSocketOptions<TOptions>,
    TPacket = ExtractSocketOptions<TOptions> & { type: TType }
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

            const packetOptions = R.mapValues(options, (entry) =>
                entry instanceof foundry.abstract.Document ? entry.uuid : entry
            ) as TPacket;

            socket?.emit({ ...packetOptions, type: packetType } as TPacket);
        }
    };
}

type ExtractSocketOptions<TOptions extends Record<string, any>> =
    ExtractSocketOptionsRequired<TOptions> & ExtractSocketOptionsPartial<TOptions>;

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
