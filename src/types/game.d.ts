import { ActorPF2e } from "foundry-pf2e";

declare module "foundry-pf2e" {
    interface GamePF2e {
        dice3d?: Dice3D;

        trigger?: {
            test: () => void;
            execute: (
                actorOrTarget: Maybe<ActorPF2e | TargetDocuments>,
                values?: unknown[]
            ) => void;
        };

        toolbelt?: toolbelt.GamePF2e;
    }
}

declare global {
    type SocketCallback<T = any> = (packet: T, senderId: string) => void;
}
