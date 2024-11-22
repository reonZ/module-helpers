import { ActorPF2e, CombatantPF2e, ItemPF2e, MacroPF2e } from "foundry-pf2e";

export {};

declare global {
    namespace foundry {
        namespace utils {
            class IterableWeakSet<T extends WeakKey> extends WeakSet<T> {
                /**
                 * Enumerate the values.
                 * @returns {Generator<any, void, any>}
                 */
                [Symbol.iterator](): Generator<T, void, T | undefined>;
            }

            class IterableWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
                /**
                 * Enumerate the entries.
                 * @returns {Generator<[any, any], void, any>}
                 */
                [Symbol.iterator](): Generator<[K, V], void, [K, V] | undefined>;
            }
        }
    }

    function getDocumentClass(name: "ChatMessage"): typeof ChatMessage;
    function getDocumentClass(name: "Combatant"): typeof CombatantPF2e;
    function getDocumentClass(name: "Macro"): typeof MacroPF2e;
    function getDocumentClass(name: "Actor"): typeof ActorPF2e;
    function getDocumentClass(name: "Item"): typeof ItemPF2e;
}
