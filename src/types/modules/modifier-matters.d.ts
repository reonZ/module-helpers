export {};

declare global {
    namespace modifiersMatter {
        type SIGNIFICANCE = "ESSENTIAL" | "HELPFUL" | "NONE" | "HARMFUL" | "DETRIMENTAL";

        type SignificantModifier = {
            appliedTo: "roll" | "dc";
            name: string;
            significance: SIGNIFICANCE;
            value: number;
        };
    }
}
