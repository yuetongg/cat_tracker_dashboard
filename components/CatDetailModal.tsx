"use client";

import { Cat, CatLog } from "@/lib/types";

type Props = {
  cat: Cat | null;
  onClose: () => void;
};

function formatDate(timestamp: any) {
  if (!timestamp) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(timestamp.toDate());
}

function getRecentLogs(logs: CatLog[] = []) {
  return [...logs]
    .filter((log) => log.loggedAt)
    .sort(
      (a, b) =>
        b.loggedAt!.toDate().getTime() -
        a.loggedAt!.toDate().getTime()
    )
    .slice(0, 5);
}

export default function CatDetailModal({
  cat,
  onClose,
}: Props) {
  if (!cat) {
    return null;
  }

  const recentLogs = getRecentLogs(cat.logs);

  return (
    <div>
      <div>
        <button onClick={onClose}>
          Close
        </button>

        <h2>
          {cat.name ?? "Unnamed cat"}
        </h2>

        <h3>Latest Information</h3>

        <p>
          <strong>Last seen:</strong>{" "}
          {formatDate(cat.lastSpotted)}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {cat.lastSpottedLocation ??
            "Unknown"}
        </p>

        <p>
          <strong>Seen by:</strong>{" "}
          {cat.lastSpottedBy ?? "Unknown"}
        </p>

        <p>
          <strong>Feeding status:</strong>{" "}
          {cat.feedingStatus ?? "Unknown"}
        </p>

        <p>
          <strong>Injured:</strong>{" "}
          {cat.isInjured ? "Yes" : "No"}
        </p>

        <h3>Recent Activity</h3>

        {recentLogs.length === 0 ? (
          <p>No activity recorded.</p>
        ) : (
          <ul>
            {recentLogs.map((log) => (
              <li key={log.id}>
                <p>
                  <strong>
                    {formatDate(log.loggedAt)}
                  </strong>
                </p>

                <p>
                  Location:{" "}
                  {log.location ?? "Unknown"}
                </p>

                <p>
                  Feeding:{" "}
                  {log.feedingStatus ??
                    "Unknown"}
                </p>

                <p>
                  Seen by:{" "}
                  {log.loggedBy ?? "Unknown"}
                </p>

                {log.isInjured && (
                  <p>
                    Injury reported
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}