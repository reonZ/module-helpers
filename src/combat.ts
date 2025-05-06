import { ActorPF2e } from "foundry-pf2e";

function isCurrentCombatant(actor: ActorPF2e) {
    return game.combat?.combatant === actor.combatant;
}

export { isCurrentCombatant };
