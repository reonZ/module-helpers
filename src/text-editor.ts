function getDragEventData<T extends Record<string, JSONValue>>(event: DragEvent): T {
    return foundry.applications.ux.TextEditor.implementation.getDragEventData(event) as T;
}

export { getDragEventData };
