export {};

declare global {
    type TextStyleFontWeight = PIXI.ITextStyle["fontWeight"];

    namespace PIXI {
        interface Rectangle {
            center: Point;
        }
    }
}
