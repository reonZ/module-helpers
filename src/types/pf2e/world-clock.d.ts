import { WorldClock } from "foundry-pf2e";

declare global {
    type WorldClockData = ReturnType<WorldClock["getData"]>;
}
