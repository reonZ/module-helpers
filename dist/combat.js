import { eventToRollParams } from "./pf2e";
function hasRolledInitiative(combatant) {
    return typeof combatant.initiative === "number";
}
function rollInitiative(actor, statistic, event) {
    const args = eventToRollParams(event, { type: "check" });
    if (!statistic) {
        return actor.initiative?.roll(args);
    }
    const ActorInit = actor.initiative?.constructor;
    if (!ActorInit)
        return;
    const initiative = new ActorInit(actor, {
        statistic,
        tiebreakPriority: actor.system.initiative.tiebreakPriority,
    });
    initiative.roll(args);
}
export { hasRolledInitiative, rollInitiative };
