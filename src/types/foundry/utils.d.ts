import { ActorPF2e, ChatMessagePF2e, CombatantPF2e, ItemPF2e, MacroPF2e } from "foundry-pf2e";

export {};

declare global {
    function getDocumentClass(name: "ChatMessage"): typeof ChatMessagePF2e;
    function getDocumentClass(name: "Combatant"): typeof CombatantPF2e;
    function getDocumentClass(name: "Macro"): typeof MacroPF2e;
    function getDocumentClass(name: "Actor"): typeof ActorPF2e;
    function getDocumentClass(name: "Item"): typeof ItemPF2e;
}
