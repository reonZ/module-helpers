import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import {
    DialogV2Button,
    DialogV2Configuration,
    DialogV2WaitOptions,
} from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";

declare global {
    type DialogWaitOptions = DeepPartial<ApplicationConfiguration> &
        DialogV2Configuration &
        DialogV2WaitOptions;

    type DialogConfirmOptions = DeepPartial<ApplicationConfiguration> &
        Omit<DialogV2Configuration, "buttons"> &
        DialogV2WaitOptions & {
            yes?: Partial<DialogV2Button>;
            no?: Partial<DialogV2Button>;
        };

    type DialogPromptOptions = DeepPartial<ApplicationConfiguration> &
        Omit<DialogV2Configuration, "buttons"> &
        DialogV2WaitOptions & {
            ok?: Partial<DialogV2Button>;
        };
}
