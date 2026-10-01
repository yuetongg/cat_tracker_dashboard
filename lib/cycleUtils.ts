import { Cat, CatLog } from "./types";
import { Cycle } from "./cycles";

export function logIsInCycle(
  log: CatLog,
  cycle: Cycle
): boolean {
  if (!log.loggedAt) return false;

  const date = log.loggedAt.toDate();

  const start = new Date(`${cycle.start}T00:00:00`);
  const end = new Date(`${cycle.end}T23:59:59`);

  return date >= start && date <= end;
}

export function catIsActiveInCycle(
  cat: Cat,
  cycle: Cycle
): boolean {
  return (
    cat.logs?.some((log) =>
      logIsInCycle(log, cycle)
    ) ?? false
  );
}