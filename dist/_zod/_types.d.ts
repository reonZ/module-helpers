import { z } from "..";
type zTypedString<T extends string> = z.core.$ZodType<T, T>;
export type { zTypedString };
