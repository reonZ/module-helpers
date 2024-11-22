function isHoldingModifierKeys(keys) {
    return keys.some((key) => game.keyboard.isModifierActive(key));
}
export { isHoldingModifierKeys };
