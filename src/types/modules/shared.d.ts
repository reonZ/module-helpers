export {};

declare global {
    interface LEVIKTIMES {
        gmOnly: "GM Only";
        reloadRequired: "Requires Reload";
        emiting: {
            label: "Sending";
            noGm: "A GM must be online in order to enact this request.";
        };
    }
}
