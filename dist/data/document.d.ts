import fields = foundry.data.fields;
import abstract = foundry.abstract;
declare function makeModuleDocument<TParent extends abstract.Document | null, TSchema extends fields.DataSchema>(metadata: () => Partial<abstract.DocumentClassMetadata>, schema: () => TSchema): ConstructorOf<ModuleDocument<TParent, TSchema> & ModelPropsFromSchema<TSchema>>;
interface ModuleDocument<TParent extends abstract.Document | null = abstract._Document | null, TSchema extends fields.DataSchema = fields.DataSchema> extends abstract.Document<TParent, TSchema> {
}
export { makeModuleDocument };
export type { ModuleDocument };
