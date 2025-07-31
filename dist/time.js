import { DateTime } from "luxon";
function advanceTime(interval, direction) {
    const sign = direction === "+" ? 1 : -1;
    const increment = Number(interval) * sign;
    if (increment !== 0) {
        game.time.advance(increment);
    }
}
function getTimeWithSeconds(time) {
    return game.pf2e.worldClock.timeConvention === 24
        ? time.toFormat("HH:mm:ss")
        : time.toLocaleString(DateTime.TIME_WITH_SECONDS);
}
function getShortTime(time) {
    return game.pf2e.worldClock.timeConvention === 24
        ? time.toFormat("HH:mm")
        : time.toLocaleString(DateTime.TIME_SIMPLE);
}
function getShortDateTime() {
    const worldClock = game.pf2e.worldClock;
    const worldTime = worldClock.worldTime;
    const time = getShortTime(worldTime);
    const date = worldClock.dateTheme === "CE"
        ? worldTime.toLocaleString(DateTime.DATE_SHORT)
        : DateTime.local(worldClock["year"], worldTime.month, worldTime.day).toLocaleString(DateTime.DATE_SHORT);
    return {
        worldClock,
        worldTime,
        time,
        date,
    };
}
export { advanceTime, getTimeWithSeconds, getShortTime, getShortDateTime };
