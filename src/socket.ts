import { assignStyle, MODULE, R, sharedLocalize, userIsGM } from ".";

const EMITING_STYLE: Partial<CSSStyleDeclaration> = {
    alignItems: "center",
    background: "linear-gradient(90deg, #00000000 0%, #00000099 50%, #00000000 100%)",
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

    const onSocket = async (packet: WithPartial<EmitablePacket<T>, "__type__">, userId: string) => {
        if (packet.__type__ !== prefix || !game.user.isActiveGM) return;

        delete packet.__type__;

        const callOptions = (await convertToCallOptions(packet)) as T;
        callback(callOptions, userId);
    };

    const emit = (options: WithSocketOptions<T>) => {
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
        async call(options: WithSocketOptions<T>): Promise<void> {
            if (!R.isPlainObject(options)) return;

            if (game.user.isGM) {
                const callOptions = (await convertToCallOptions(options)) as T;
                return callback(callOptions, game.userId);
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

async function convertToCallOptions(options: Record<string, any>): Promise<Record<string, any>> {
    const callOptions: Record<string, any> = {};

    await Promise.all(
        R.entries(options).map(async ([key, value]) => {
            if (!R.isString(value)) {
                callOptions[key] = value;
                return;
            }

            try {
                const parseResult = foundry.utils.parseUuid(value);

                if (
                    parseResult?.documentId &&
                    parseResult.type &&
                    ["Item", "Actor", "Token", "ChatMessage"].includes(parseResult.type)
                ) {
                    callOptions[key] = await fromUuid(value);
                } else {
                    callOptions[key] = value;
                }
            } catch {
                callOptions[key] = value;
            }
        })
    );

    return callOptions;
}

function convertToEmitOptions<T extends Record<string, any>>(options: T): EmitablePacket<T> {
    return R.mapValues(options, (value) => {
        return value instanceof foundry.abstract.Document ? value.uuid : value;
    }) as EmitablePacket<T>;
}

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
          [k in TKey]?: NonNullable<TPartial[k]> extends ClientDocument
              ? TPartial[k] | string | null
              : TPartial[k];
      }
    : never;

type WithSocketOptions<TOptions extends Record<string, any>> = Prettify<
    WithSocketOptionsRequired<TOptions> & WithSocketOptionsPartial<TOptions>
>;

type Emitable<TOptions extends Record<string, any>> = {
    get enabled(): boolean;
    call: (options: WithSocketOptions<TOptions>) => Promise<void>;
    emit: (options: WithSocketOptions<TOptions>) => void;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};

type EmitablePacket<TOptions extends Record<string, any>> = WithSocketOptions<TOptions> & {
    __type__: string;
};

export { createEmitable, socketEmit, socketOff, socketOn };
