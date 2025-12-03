import { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import { assignStyle, isValidTargetDocuments, MODULE, R, sharedLocalize, userIsGM } from ".";

const EMITING_STYLE: Partial<CSSStyleDeclaration> = {
    alignItems: "center",
    background:
        "linear-gradient(90deg, #00000000 0%, #0000001a 20%, #00000066 50%, #0000001a 80%, #00000000 100%)",
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

function socketOn<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.on(`module.${MODULE.id}`, callback);
}

function socketOff<T extends object = object>(callback: SocketCallback<T>) {
    game.socket.off(`module.${MODULE.id}`, callback);
}

function socketEmit<T extends object = object>(packet: T) {
    game.socket.emit(`module.${MODULE.id}`, packet);
}

let _emitingElement: HTMLElement;
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

function createEmitable<T extends Record<string, any>>(
    prefix: string,
    callback: (options: T, userId: string) => void | Promise<void>
): Emitable<T> {
    let _enabled = false;

    const onSocket = async (packet: EmitablePacket<T>, userId: string) => {
        if (packet.__type__ !== prefix || !game.user.isActiveGM) return;

        const callOptions = (await convertToCallOptions(packet)) as T;
        callback(callOptions, userId);
    };

    const emit = (options: T) => {
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
        get enabled(): boolean {
            return _enabled;
        },
        async call(options: T): Promise<void> {
            if (!R.isPlainObject(options)) return;

            if (game.user.isActiveGM) {
                return callback(options, game.userId);
            } else {
                emit(options);
            }
        },
        emit,
        activate() {
            if (this.enabled || !userIsGM()) return;
            _enabled = true;
            socketOn(onSocket);
        },
        disable() {
            if (!this.enabled) return;
            _enabled = false;
            socketOff(onSocket);
        },
        toggle(enabled?: boolean) {
            enabled ??= !this.enabled;

            if (enabled) {
                this.activate();
            } else {
                this.disable();
            }
        },
    };
}

async function convertToCallOptions<T extends EmitableOptions>(
    options: EmitablePacket<T>
): Promise<EmitablePacketOptions<T>> {
    const __converted__ = options.__converter__;

    // @ts-expect-error
    delete options.__converter__;
    // @ts-expect-error
    delete options.__type__;

    return Promise.all(
        R.entries(options).map(async ([key, value]) => {
            switch (__converted__[key]) {
                case "document": {
                    return fromUuid(value);
                }

                case "target": {
                    return convertTargetFromPacket(value);
                }

                case "token": {
                    const tokenDocument = await fromUuid<TokenDocumentPF2e>(value);
                    return tokenDocument?.object;
                }

                default: {
                    return value;
                }
            }
        })
    ) as Promise<EmitablePacketOptions<T>>;
}

async function convertTargetFromPacket(target: {
    actor: string;
    token?: string;
}): Promise<TargetDocuments | undefined> {
    const actor = await fromUuid<ActorPF2e>(target.actor);
    if (!(actor instanceof Actor)) return;

    return {
        actor,
        token: (target.token && (await fromUuid<TokenDocumentPF2e>(target.token))) || undefined,
    };
}

function convertToEmitOptions<T extends EmitableOptions>(options: T): EmitablePacket<T> {
    const __converter__: EmitableConverted = {};

    const convertedOptions = R.mapValues(options, (value, key): unknown => {
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
    }) as EmitablePacket<T>;

    convertedOptions.__converter__ = __converter__;

    return convertedOptions;
}

type Emitable<T> = {
    get enabled(): boolean;
    call: (options: T) => Promise<void>;
    emit: (options: T) => void;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};

type EmitablePacket<T extends EmitableOptions> = EmitablePacketOptions<T> & {
    __type__: string;
    __converter__: EmitableConverted;
};

type EmitableConverted = Record<string, "document" | "target" | "token" | undefined>;

type EmitableOptions = Record<string, any> | any[];

type EmitablePacketOptions<T extends EmitableOptions> = T extends Array<infer V>
    ? Record<string, V>
    : T;

export {
    convertTargetFromPacket,
    convertToCallOptions,
    convertToEmitOptions,
    createEmitable,
    displayEmiting,
    socketEmit,
    socketOff,
    socketOn,
};
export type { EmitableConverted, EmitablePacket };
