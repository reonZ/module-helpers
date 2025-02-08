export {};

declare global {
    interface Game<
        TActor extends Actor<null>,
        TActors extends Actors<TActor>,
        TChatMessage extends ChatMessage,
        TCombat extends Combat,
        TItem extends Item<null>,
        TMacro extends Macro,
        TScene extends Scene,
        TUser extends User<TActor>
    > {
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
            test?: () => void;
            execute?: (id: string, target: TargetDocuments, values?: any[]) => Promise<void>;
        };
    }
}

declare module "foundry-pf2e/types/foundry/client/game.js" {}
