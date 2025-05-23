declare function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]): T | undefined;
declare function setFlag<D extends foundry.abstract.Document, T>(doc: D, ...args: [...string[], T]): Promise<D>;
declare function unsetFlag<D extends foundry.abstract.Document>(doc: D, ...path: string[]): Promise<D>;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function setFlagProperties<T extends object>(obj: T, ...args: [...string[], properties: Record<string, any>]): T;
export { deleteFlagProperty, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, };
