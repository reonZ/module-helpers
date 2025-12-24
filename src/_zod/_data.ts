import { z } from "..";

const zID = z.string().trim().length(16).default(foundry.utils.randomID).readonly();

const zPosition = z
    .object({
        x: z.number().default(0),
        y: z.number().default(0),
    })
    .default({ x: 0, y: 0 });

const zString = z.string().trim().min(1);

export { zID, zPosition, zString };
