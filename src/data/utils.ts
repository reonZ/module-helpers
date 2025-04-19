import DataModel = foundry.abstract.DataModel;

/**
 * https://github.com/foundryvtt/pf2e/blob/47ec7fa88f43d42e558362af86d0cb30b2da849d/src/module/item/base/sheet/rule-element-form/base.ts#L114
 */
function getDataModelFailures(data: DataModel): string[] {
    const fieldFailures = data.validationFailures.fields?.asError().getAllFailures() ?? {};
    const jointFailures = data.validationFailures.joint
        ? { joint: data.validationFailures.joint }
        : {};

    return Object.entries({ ...fieldFailures, ...jointFailures }).map(([key, failure]) =>
        key === "joint"
            ? failure.message.replace(/^.*Joint Validation Error:\s*/, "")
            : `${key}: ${failure.message}`
    );
}

export { getDataModelFailures };
