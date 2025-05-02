export {};

declare module "foundry-pf2e" {
    interface GamePF2e {
        dice3d?: Dice3D;

        trigger?: {
            test: () => void;
        };
    }
}
