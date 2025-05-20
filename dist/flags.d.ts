declare function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]): T | undefined;
declare function setFlag<D extends foundry.abstract.Document, T>(doc: D, ...args: [...string[], T]): Promise<D>;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function setFlagProperties<T extends object>(obj: T, ...args: [...string[], properties: Record<string, any>]): T;
export { getFlag, setFlag, setFlagProperties, setFlagProperty };
