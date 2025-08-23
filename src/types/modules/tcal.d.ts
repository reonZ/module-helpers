import { ActorPF2e } from "foundry-pf2e";

export {};

declare global {
    namespace tcal {
        interface GamePF2e {
            isTransientActor(actor: ActorPF2e): boolean;
        }
    }
}
