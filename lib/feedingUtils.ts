import { Cat } from "./types";
import { Cycle } from "./cycles";
import { logIsInCycle } from "./cycleUtils";

export function getFeedingCount(
  cats: Cat[],
  cycle: Cycle,
  selectedDate?: string
): number {
  const feedingCats = new Set<string>();

  cats.forEach((cat) => {
    cat.logs?.forEach((log) => {
      if (
        logIsInCycle(log, cycle) &&
        log.feedingStatus === "fed" &&
        log.loggedAt
      ) {
        const date = log.loggedAt
          .toDate()
          .toISOString()
          .slice(0, 10);

        if (!selectedDate || date === selectedDate) {
          feedingCats.add(`${cat.id}-${date}`);
        }
      }
    });
  });

  return feedingCats.size;
}