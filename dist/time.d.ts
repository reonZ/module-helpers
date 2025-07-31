import { DateTime } from "luxon";
declare function advanceTime(interval: TimeInterval, direction: "+" | "-"): void;
declare function getTimeWithSeconds(time: DateTime): string;
declare function getShortTime(time: DateTime): string;
declare function getShortDateTime(): {
    worldClock: import("foundry-pf2e").WorldClock;
    worldTime: DateTime<boolean>;
    time: string;
    date: string;
};
type TimeInterval = "dawn" | "noon" | "dusk" | "midnight" | `${number}` | number;
export { advanceTime, getTimeWithSeconds, getShortTime, getShortDateTime };
