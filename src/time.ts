import { WorldClock } from "foundry-pf2e";
import { DateTime } from "luxon";

function getShortDateTime() {
    const worldClock = game.pf2e.worldClock;
    const worldTime = worldClock.worldTime;

    const time =
        worldClock.timeConvention === 24
            ? worldTime.toFormat("HH:mm")
            : worldTime.toLocaleString(DateTime.TIME_SIMPLE);

    const date = worldTime.toLocaleString(DateTime.DATE_SHORT);

    return {
        worldClock,
        worldTime,
        time,
        date,
    };
}

function advanceTime(interval: TimeInterval, direction: "+" | "-") {
    const WorldClockCls = game.pf2e.worldClock.constructor as typeof WorldClock;
    const worldTime = game.pf2e.worldClock.worldTime;

    const increment = /** private */ WorldClockCls["calculateIncrement"](
        worldTime,
        interval,
        direction
    );

    if (increment !== 0) {
        game.time.advance(increment);
    }
}

type TimeInterval = "dawn" | "noon" | "dusk" | "midnight" | `${number}`;

export type { TimeInterval };
export { advanceTime, getShortDateTime };
