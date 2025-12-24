import { z } from "..";

declare global {
    type zTypedString<T extends string> = z.core.$ZodType<T, T>;
}
