import { z } from "..";
declare const zID: z.ZodReadonly<z.ZodDefault<z.ZodString>>;
declare const zPosition: z.ZodDefault<z.ZodObject<{
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
}, z.z.core.$strip>>;
declare const zString: z.ZodString;
export { zID, zPosition, zString };
