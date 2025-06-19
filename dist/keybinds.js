import { createHTMLElement, htmlQuery, localize, localizeIfExist, MODULE, R } from ".";
function isHoldingModifierKey(key) {
    const keys = R.isArray(key) ? key : [key];
    return keys.some((key) => game.keyboard.isModifierActive(key));
}
function registerKeybind(name, data) {
    game.keybindings.register(MODULE.id, name, {
        ...data,
        name: data.name ?? MODULE.path("keybindings", name, "name"),
        hint: data.hint ?? MODULE.path("keybindings", name, "hint"),
    });
}
function registerModuleKeybinds(keybinds) {
    for (const [group, entries] of R.entries(keybinds)) {
        for (const keybind of entries) {
            game.keybindings.register(MODULE.id, `${group}-${keybind.name}`, {
                ...keybind,
                name: MODULE.path("keybindings", group, keybind.name, "name"),
                hint: MODULE.path("keybindings", group, keybind.name, "hint"),
            });
        }
    }
    Hooks.on("renderControlsConfig", (_, html, options) => {
        onRenderControlsConfig(html, options, keybinds);
    });
}
function onRenderControlsConfig(html, options, keybinds) {
    const id = MODULE.id;
    const tab = htmlQuery(html, `[data-application-part="main"] [data-group="categories"][data-tab="${id}"][data-category="${id}"]`);
    if (!tab)
        return;
    const keybindKeys = R.keys(keybinds);
    for (let i = 0; i < keybindKeys.length; i++) {
        const key = keybindKeys[i];
        if (!key)
            continue;
        const group = htmlQuery(tab, `.form-group[data-action-id^="${MODULE.id}.${key}"]`);
        const title = createHTMLElement("h4", {
            content: localizeIfExist("keybindings", key, "title") ?? localize("settings", key, "title"),
        });
        title.style.marginBlock = i === 0 ? "0" : "0.5em 0em";
        group?.before(title);
    }
}
function createToggleKeybind(options) {
    const _actions = {
        onDown: (context) => { },
        onUp: (context) => { },
    };
    return {
        configs: {
            ...options,
            onDown: (context) => {
                _actions.onDown(context);
            },
            onUp: (context) => {
                _actions.onUp(context);
            },
        },
        activate() {
            _actions.onDown = (context) => {
                options.onDown?.(context);
            };
            _actions.onUp = (context) => {
                options.onUp?.(context);
            };
        },
        disable() {
            _actions.onDown = (context) => { };
            _actions.onUp = (context) => { };
        },
        toggle(enabled) {
            if (enabled) {
                this.activate();
            }
            else {
                this.disable();
            }
        },
    };
}
export { createToggleKeybind, isHoldingModifierKey, registerKeybind, registerModuleKeybinds };
