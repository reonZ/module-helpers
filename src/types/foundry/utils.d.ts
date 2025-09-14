export {};

declare global {
    type DocumentOwnership = {
        [K in Stringptionel<"default">]?: DocumentOwnershipLevel;
    };
}
