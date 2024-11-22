import {
    ApplicationRenderContext,
    ApplicationRenderOptions,
} from "foundry-pf2e/foundry/client-esm/applications/_types.js";

declare module "foundry-pf2e/foundry/client-esm/applications/api/application.js" {
    interface DialogV2Button {
        action: string;
        label: string;
        icon?: string;
        class?: string;
        default?: boolean;
        callback?: DialogV2ButtonCallback;
    }

    type DialogV2ButtonCallback = (
        event: PointerEvent | SubmitEvent,
        button: HTMLButtonElement,
        dialog: HTMLDialogElement
    ) => Promise<any>;

    type DialogV2SubmitCallback = (result: any) => Promise<void>;

    interface DialogV2Configuration {
        modal?: boolean;
        buttons: DialogV2Button[];
        content?: string;
        submit?: DialogV2SubmitCallback;
    }

    type DialogV2RenderCallback = (event: Event, dialog: HTMLDialogElement) => void;

    type DialogV2CloseCallback = (event: Event, dialog: foundry.applications.api.DialogV2) => void;

    interface DialogV2WaitOptions
        extends PartialApplicationConfiguration,
            Partial<DialogV2Configuration> {
        render?: DialogV2RenderCallback;
        close?: DialogV2CloseCallback;
        /** @default true */
        rejectClose?: boolean;
    }

    interface DialogV2PromptOptions extends DialogV2WaitOptions {
        ok?: Partial<DialogV2Button>;
    }

    class DialogV2 extends ApplicationV2 {
        protected _renderHTML(
            context: ApplicationRenderContext,
            options: ApplicationRenderOptions
        ): Promise<unknown>;
        protected _replaceHTML(
            result: unknown,
            content: HTMLElement,
            options: ApplicationRenderOptions
        ): void;

        /**
         * A utility helper to generate a dialog with yes and no buttons.
         * @param {Partial<ApplicationConfiguration & DialogV2Configuration & DialogV2WaitOptions>} [options]
         * @param {DialogV2Button} [options.yes]  Options to overwrite the default yes button configuration.
         * @param {DialogV2Button} [options.no]   Options to overwrite the default no button configuration.
         * @returns {Promise<any>}                Resolves to true if the yes button was pressed, or false if the no button
         *                                        was pressed. If additional buttons were provided, the Promise resolves to
         *                                        the identifier of the one that was pressed, or the value returned by its
         *                                        callback. If the dialog was dismissed, and rejectClose is false, the
         *                                        Promise resolves to null.
         */
        static confirm(
            options?: DialogV2WaitOptions & {
                yes?: Partial<DialogV2Button>;
                no?: Partial<DialogV2Button>;
            }
        ): Promise<true | false | null>;

        /**
         * A utility helper to generate a dialog with a single confirmation button.
         * @param {Partial<ApplicationConfiguration & DialogV2Configuration & DialogV2WaitOptions>} [options]
         * @param {Partial<DialogV2Button>} [options.ok]  Options to overwrite the default confirmation button configuration.
         * @returns {Promise<any>}                        Resolves to the identifier of the button used to submit the dialog,
         *                                                or the value returned by that button's callback. If the dialog was
         *                                                dismissed, and rejectClose is false, the Promise resolves to null.
         */
        static prompt(options?: DialogV2PromptOptions): Promise<any>;

        /**
         * Spawn a dialog and wait for it to be dismissed or submitted.
         * @param {Partial<ApplicationConfiguration & DialogV2Configuration>} [options]
         * @param {DialogV2RenderCallback} [options.render]  A function to invoke whenever the dialog is rendered.
         * @param {DialogV2CloseCallback} [options.close]    A function to invoke when the dialog is closed under any
         *                                                   circumstances.
         * @param {boolean} [options.rejectClose=true]       Throw a Promise rejection if the dialog is dismissed.
         * @returns {Promise<any>}                           Resolves to the identifier of the button used to submit the
         *                                                   dialog, or the value returned by that button's callback. If the
         *                                                   dialog was dismissed, and rejectClose is false, the Promise
         *                                                   resolves to null.
         */
        static wait(options?: DialogV2WaitOptions): Promise<any>;
    }
}
