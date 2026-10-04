import { Cat } from "./types";

function getSingaporeDate(timestamp: any): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
  }).format(timestamp.toDate());
}

export function getFeedingCount(
  cats: Cat[],
  startDate?: string,
  endDate?: string
): number {
  const feedingCats = new Set<string>();

  cats.forEach((cat) => {
    cat.logs?.forEach((log) => {
      if (!log.loggedAt || log.feedingStatus !== "fed") {
        return;
      }

      const date = getSingaporeDate(log.loggedAt);

      const matchesStartDate =
        !startDate || date >= startDate;

      const matchesEndDate =
        !endDate || date <= endDate;

      if (matchesStartDate && matchesEndDate) {
        feedingCats.add(`${cat.id}-${date}`);
      }
    });
  });

  return feedingCats.size;
}
export function getFeedingsByDate(
  cats: Cat[],
  startDate?: string,
  endDate?: string
) {
  const feedingByDate = new Map<
    string,
    Map<string, Set<string>>
  >();

  cats.forEach((cat) => {
    cat.logs?.forEach((log) => {
      if (!log.loggedAt || log.feedingStatus !== "fed") {
        return;
      }

      const date = getSingaporeDate(log.loggedAt);
      const location = log.location ?? "Unknown";

      const matchesStartDate =
        !startDate || date >= startDate;

      const matchesEndDate =
        !endDate || date <= endDate;

      if (!matchesStartDate || !matchesEndDate) {
        return;
      }

      if (!feedingByDate.has(date)) {
        feedingByDate.set(date, new Map());
      }

      const locations = feedingByDate.get(date)!;

      if (!locations.has(location)) {
        locations.set(location, new Set());
      }

      locations.get(location)!.add(cat.id);
    });
  });

  return Array.from(feedingByDate.entries())
    .map(([date, locations]) => {
      const result: {
        date: string;
        [location: string]: string | number;
      } = { date };

      locations.forEach((catIds, location) => {
        result[location] = catIds.size;
      });

      return result;
    })
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );
}