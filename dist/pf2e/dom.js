function htmlQuery(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return null;
    return parent.querySelector(selectors);
}
function htmlQueryAll(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return [];
    return Array.from(parent.querySelectorAll(selectors));
}
function htmlClosest(child, selectors) {
    if (!(child instanceof Element))
        return null;
    return child.closest(selectors);
}
export { htmlClosest, htmlQuery, htmlQueryAll };
