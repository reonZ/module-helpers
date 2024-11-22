import { IterableWeakMap, IterableWeakSet } from "foundry-pf2e/foundry/common/utils/module.js";

export {};

declare global {
    interface Actor<TParent extends TokenDocument | null = TokenDocument | null> {
        /**
         * Maintain a list of Token Documents that represent this Actor, stored by Scene.
         * @type {IterableWeakMap<Scene, IterableWeakSet<TParent>>}
         * @private
         */
        _dependentTokens: IterableWeakMap<Scene, IterableWeakSet<Exclude<TParent, null>>>;
    }
}
