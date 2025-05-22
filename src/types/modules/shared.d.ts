import { LocalizeArgs } from "../../localize";

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

    namespace MyModule {
        interface GamePF2e<TApi extends Record<string, any>> {
            active: boolean;
            api: TApi;
            localize(...args: LocalizeArgs): string;
        }
    }
}
