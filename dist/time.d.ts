import { WorldClock } from "foundry-pf2e";
import { DateTime } from "luxon";
declare function getShortDateTime(): {
    worldClock: WorldClock;
    worldTime: DateTime<boolean>;
    time: string;
    date: string;
};
declare function getShortTime(time: DateTime): string;
declare function getTimeWithSeconds(time: DateTime): string;
declare function advanceTime(interval: TimeInterval, direction: "+" | "-"): void;
type TimeInterval = "dawn" | "noon" | "dusk" | "midnight" | `${number}` | number;
export type { TimeInterval };
export { advanceTime, getShortDateTime, getShortTime, getTimeWithSeconds };
