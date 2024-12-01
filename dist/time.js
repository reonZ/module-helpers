import { DateTime } from "luxon";
function getShortDateTime() {
    const worldClock = game.pf2e.worldClock;
    const worldTime = worldClock.worldTime;
    const time = getShortTime(worldTime);
    const date = worldClock.dateTheme === "CE"
        ? worldTime.toLocaleString(DateTime.DATE_SHORT)
        : DateTime.local(
        /** private */ worldClock["year"], worldTime.month, worldTime.day).toLocaleString(DateTime.DATE_SHORT);
    return {
        worldClock,
        worldTime,
        time,
        date,
    };
}
function getShortTime(time) {
    return game.pf2e.worldClock.timeConvention === 24
        ? time.toFormat("HH:mm")
        : time.toLocaleString(DateTime.TIME_SIMPLE);
}
function getTimeWithSeconds(time) {
    return game.pf2e.worldClock.timeConvention === 24
        ? time.toFormat("HH:mm:ss")
        : time.toLocaleString(DateTime.TIME_WITH_SECONDS);
}
function advanceTime(interval, direction) {
    const WorldClockCls = game.pf2e.worldClock.constructor;
    const worldTime = game.pf2e.worldClock.worldTime;
    const increment = /** private */ WorldClockCls["calculateIncrement"](worldTime, interval, direction);
    if (increment !== 0) {
        game.time.advance(increment);
    }
}
export { advanceTime, getShortDateTime, getShortTime, getTimeWithSeconds };
