import { assignStyle, MODULE, R, sharedLocalize } from ".";

const EMITING_STYLE: Partial<CSSStyleDeclaration> = {
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
        if (packet.__type__ !== prefix) return;

        delete packet.__type__;

        const callOptions = (await convertToCallOptions(packet)) as T;
        callback(callOptions, userId);
    };

    return {
        get enabled(): boolean {
            return _enabled;
        },
        async call(options: WithSocketOptions<T>, userId?: string): Promise<void> {
            if (!R.isPlainObject(options)) return;

            if (game.user.isGM) {
                const callOptions = (await convertToCallOptions(options)) as T;
                return callback(callOptions, userId ?? game.userId);
            } else {
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
            if (this.enabled) return;
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
            if (R.isPlainObject(value)) {
                callOptions[key] = await convertToCallOptions(value);
                return;
            } else if (!R.isString(value)) {
                callOptions[key] = value;
                return;
            }

            try {
                const parseResult = foundry.utils.parseUuid(value);

                if (
                    parseResult?.documentId &&
                    parseResult.type &&
                    ["Item", "Actor", "Token"].includes(parseResult.type)
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
        return value instanceof foundry.abstract.Document
            ? value.uuid
            : R.isPlainObject(value)
            ? convertToEmitOptions(value)
            : value;
    }) as EmitablePacket<T>;
}

type WithSocketOptionsRequired<
    TOptions extends Record<string, any>,
    TRequired = RequiredFieldsOnly<TOptions>
> = TRequired extends Record<infer TKey, any>
    ? {
          [k in TKey]: TRequired[k] extends ClientDocument
              ? TRequired[k] | string
              : TRequired[k] extends Record<string, any>
              ? WithSocketOptions<TRequired[k]>
              : TRequired[k];
      }
    : never;

type WithSocketOptionsPartial<
    TOptions extends Record<string, any>,
    TPartial = PartialFieldsOnly<TOptions>
> = TPartial extends Partial<Record<infer TKey, any>>
    ? {
          [k in TKey]?: NonNullable<TPartial[k]> extends ClientDocument
              ? TPartial[k] | string
              : NonNullable<TPartial[k]> extends Record<string, any>
              ? WithSocketOptions<TPartial[k]>
              : TPartial[k];
      }
    : never;

type WithSocketOptions<TOptions extends Record<string, any>> = Prettify<
    WithSocketOptionsRequired<TOptions> & WithSocketOptionsPartial<TOptions>
>;

type Emitable<TOptions extends Record<string, any>> = {
    get enabled(): boolean;
    call: (options: WithSocketOptions<TOptions>, userId?: string) => Promise<void>;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};

type EmitablePacket<TOptions extends Record<string, any>> = WithSocketOptions<TOptions> & {
    __type__: string;
};

export { createEmitable, socketEmit, socketOff, socketOn };
