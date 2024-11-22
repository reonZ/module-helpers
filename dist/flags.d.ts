import { MODULE } from "./module";
declare function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]): T | undefined;
declare function setFlag<T>(doc: foundry.abstract.Document, ...args: [...string[], T]): Promise<import("foundry-pf2e/foundry/common/abstract/document.js").default<import("foundry-pf2e/foundry/common/abstract/document.js")._Document | null, import("foundry-pf2e/foundry/common/data/fields.js").DataSchema>>;
declare function unsetFlag(doc: foundry.abstract.Document, ...path: string[]): Promise<import("foundry-pf2e/foundry/common/abstract/document.js").default<import("foundry-pf2e/foundry/common/abstract/document.js")._Document | null, import("foundry-pf2e/foundry/common/data/fields.js").DataSchema> | undefined>;
declare function flagPath(...path: string[]): `flags.${typeof MODULE.id}.${string}`;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function unsetFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function updateFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document, updates: Partial<Record<keyof T, T[keyof T]>> & {
    [k: string]: any;
}): Promise<import("foundry-pf2e/foundry/common/abstract/document.js").default<import("foundry-pf2e/foundry/common/abstract/document.js")._Document | null, import("foundry-pf2e/foundry/common/data/fields.js").DataSchema> | undefined>;
declare function getModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document): T | undefined;
declare function hasModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document): boolean;
declare function unsetMofuleFlag(doc: foundry.abstract.Document): Promise<import("foundry-pf2e/foundry/common/abstract/document.js").default<import("foundry-pf2e/foundry/common/abstract/document.js")._Document | null, import("foundry-pf2e/foundry/common/data/fields.js").DataSchema> | undefined>;
declare function updateSourceFlag(doc: foundry.abstract.Document, ...args: [...string[], any]): DeepPartial<SourceFromSchema<import("foundry-pf2e/foundry/common/data/fields.js").DataSchema>>;
export { deleteFlagProperty, flagPath, getFlag, getFlagProperty, getModuleFlag, hasModuleFlag, setFlag, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, unsetFlagProperty, unsetMofuleFlag, };
