export {};

declare module "foundry-pf2e" {
    interface GamePF2e {
        toolbelt?: {
            getToolSetting: <
                TName extends keyof toolbelt.settings,
                TSetting extends keyof toolbelt.settings[TName]
            >(
                name: TName,
                setting: TSetting
            ) => toolbelt.settings[TName][TSetting];
        };

        dice3d?: Dice3D;

        trigger?: {
            getTriggersList?: () => object[];
            getSchema?: (nodeData: any) => object;
            test?: () => void;
            execute?: (id: string, target: TargetDocuments, values?: any[]) => Promise<void>;
        };
    }
}
