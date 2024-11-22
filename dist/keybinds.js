import { MODULE } from "./module";
function registerKeybind(name, data) {
    game.keybindings.register(MODULE.id, name, {
        ...data,
        name: MODULE.path("keybindings", name, "name"),
        hint: MODULE.path("keybindings", name, "hint"),
    });
}
export { registerKeybind };
