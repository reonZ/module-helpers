import { z } from "..";
declare function zID(): z.ZodReadonly<z.ZodDefault<z.ZodString>>;
declare function zPosition(): z.ZodDefault<z.ZodObject<{
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
}, z.z.core.$strip>>;
/**
 * `z.string().trim().min(1)`
 */
declare function zString(): z.ZodString;
export { zID, zPosition, zString };
