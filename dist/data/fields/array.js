var fields = foundry.data.fields;
function createSchemaArray(schemaField, schemaOptions = {}, arrayOptions = {}) {
    return new fields.ArrayField(new fields.SchemaField(schemaField, schemaOptions), arrayOptions);
}
export { createSchemaArray };
