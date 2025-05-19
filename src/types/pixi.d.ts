export {};

declare global {
    type TextStyleFontWeight = PIXI.ITextStyle["fontWeight"];

    namespace PIXI {
        interface Rectangle {
            center: Point;
        }

        interface ColorMatrixFilter extends PIXI.Filter {
            sepia(multiply?: boolean): void;
            contrast(scale: number, multiply?: boolean): void;
            greyscale(scale: number, multiply?: boolean): void;
        }
    }
}
