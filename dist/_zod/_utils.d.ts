import { z } from "..";
declare function zForceSafeParse<T extends z.ZodType>(zod: Maybe<T>, data: z.input<T>): z.output<T>;
export { zForceSafeParse };
