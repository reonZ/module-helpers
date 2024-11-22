function toggleControlTool(name, active) {
    const toggle = ui.controls.control?.tools.find((t) => t.name === name);
    if (toggle?.toggle) {
        toggle.active = active;
        ui.controls.render();
    }
}
export { toggleControlTool };
