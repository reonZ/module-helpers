function zForceSafeParse(zod, data) {
    return zod?.safeParse(data)?.data ?? zod?.safeParse({})?.data ?? {};
}
export { zForceSafeParse };
