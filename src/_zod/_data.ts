import { z } from "..";

function zID() {
    return z.string().trim().length(16).default(foundry.utils.randomID).readonly();
}

function zPosition() {
    return z
        .object({
            x: z.number().default(0),
            y: z.number().default(0),
        })
        .default({ x: 0, y: 0 });
}

/**
 * `z.string().trim().min(1)`
 */
function zString() {
    return z.string().trim().min(1);
}

export { zID, zPosition, zString };
