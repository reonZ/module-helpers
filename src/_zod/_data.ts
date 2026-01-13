import { z } from "..";

const zID = z.string().trim().refine(foundry.data.validators.isValidId).default(foundry.utils.randomID).readonly();

const zPosition = z
    .object({
        x: z.number().default(0),
        y: z.number().default(0),
    })
    .default(() => ({ x: 0, y: 0 }));

const zString = z.string().trim().min(1);

const zRecord = z.record(z.string(), z.unknown());

export { zID, zPosition, zRecord, zString };
