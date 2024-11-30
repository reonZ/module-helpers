import { DateTime } from "luxon";
function getShortDateTime() {
    const worldClock = game.pf2e.worldClock;
    const worldTime = worldClock.worldTime;
    const time = worldClock.timeConvention === 24
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
function advanceTime(interval, direction) {
    const WorldClockCls = game.pf2e.worldClock.constructor;
    const worldTime = game.pf2e.worldClock.worldTime;
    const increment = /** private */ WorldClockCls["calculateIncrement"](worldTime, interval, direction);
    if (increment !== 0) {
        game.time.advance(increment);
    }
}
export { advanceTime, getShortDateTime };
