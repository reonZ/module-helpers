import { EncounterPF2e, RolledCombatant } from "foundry-pf2e";

function setInitiativeFromDrop(
    encounter: EncounterPF2e,
    newOrder: RolledCombatant<EncounterPF2e>[],
    dropped: RolledCombatant<EncounterPF2e>
): void {
    const aboveDropped = newOrder.find(
        (c) => newOrder.indexOf(c) === newOrder.indexOf(dropped) - 1
    );
    const belowDropped = newOrder.find(
        (c) => newOrder.indexOf(c) === newOrder.indexOf(dropped) + 1
    );

    const hasAboveAndBelow = !!aboveDropped && !!belowDropped;
    const hasAboveAndNoBelow = !!aboveDropped && !belowDropped;
    const hasBelowAndNoAbove = !aboveDropped && !!belowDropped;
    const aboveIsHigherThanBelow =
        hasAboveAndBelow && belowDropped.initiative < aboveDropped.initiative;
    const belowIsHigherThanAbove =
        hasAboveAndBelow && belowDropped.initiative < aboveDropped.initiative;
    const wasDraggedUp =
        !!belowDropped &&
        encounter.getCombatantWithHigherInit(dropped, belowDropped) === belowDropped;
    const wasDraggedDown = !!aboveDropped && !wasDraggedUp;

    // Set a new initiative intuitively, according to allegedly commonplace intuitions
    dropped.initiative =
        hasBelowAndNoAbove || (aboveIsHigherThanBelow && wasDraggedUp)
            ? belowDropped.initiative + 1
            : hasAboveAndNoBelow || (belowIsHigherThanAbove && wasDraggedDown)
            ? aboveDropped.initiative - 1
            : hasAboveAndBelow
            ? belowDropped.initiative
            : dropped.initiative;

    const withSameInitiative = newOrder.filter((c) => c.initiative === dropped.initiative);
    if (withSameInitiative.length > 1) {
        for (let priority = 0; priority < withSameInitiative.length; priority++) {
            withSameInitiative[priority].flags.pf2e.overridePriority[dropped.initiative] = priority;
        }
    }
}

/** Save the new order, or reset the viewed order if no change was made */
async function saveNewOrder(
    encounter: EncounterPF2e,
    newOrder: RolledCombatant<EncounterPF2e>[]
): Promise<void> {
    await encounter.setMultipleInitiatives(
        newOrder.map((c) => ({
            id: c.id,
            value: c.initiative,
            overridePriority: c.overridePriority(c.initiative),
        }))
    );
}

export { saveNewOrder, setInitiativeFromDrop };
