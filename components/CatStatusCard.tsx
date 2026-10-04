"use client";

import { Cat } from "@/lib/types";
import { useState } from "react";
import { cycles } from "@/lib/cycles";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  selectedCycleId: string;
  onCycleChange: (cycleId: string) => void;
  totalCats: number;
  activeCats: Cat[];
  inactiveCats: Cat[];
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function CatStatusCard({
  selectedCycleId,
  onCycleChange,
  totalCats,
  activeCats,
  inactiveCats,
}: Props) {
  const selectedCycle = cycles.find(
    (cycle) => cycle.id === selectedCycleId
  );
  const [viewingCats, setViewingCats] = useState<
  "active" | "inactive" | null
>(null);

  const data = [
    {
      name: "Active",
      value: activeCats.length,
    },
    {
      name: "Inactive",
      value: inactiveCats.length,
    },
  ];

  return (
    <section>
      <h2>Cat Status</h2>

      <label htmlFor="cycle">Cycle: </label>

      <select
        id="cycle"
        value={selectedCycleId}
        onChange={(e) => onCycleChange(e.target.value)}
      >
        <option value="">Select a cycle</option>

        {cycles.map((cycle) => (
          <option key={cycle.id} value={cycle.id}>
            {cycle.name} ({formatDate(cycle.start)} –{" "}
            {formatDate(cycle.end)})
          </option>
        ))}
      </select>

      
      <div>
        <div>
            <p>Total</p>
            <p>{totalCats}</p>
        </div>

        {selectedCycle ? (
            <>
            <div>
                <p>Active</p>
                <p>{activeCats.length}</p>
            </div>

            <div>
                <p>Inactive</p>
                <p>{inactiveCats.length}</p>
            </div>
            </>
        ) : (
            <p>Select a cycle to view active and inactive cats.</p>
        )}
        </div>

      {selectedCycle && (
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry) => (
              <Cell key={entry.name} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      )}
            {selectedCycle && (
                <div>
                    <button onClick={() => setViewingCats("active")}>
                    View Active Cats
                    </button>

                    <button onClick={() => setViewingCats("inactive")}>
                    View Inactive Cats
                    </button>
                </div>
                )}
                {viewingCats && (
        <div>
            <div>
            <h3>
                {viewingCats === "active"
                ? "Active Cats"
                : "Inactive Cats"}
            </h3>

            <button onClick={() => setViewingCats(null)}>
                Close
            </button>
            </div>

            {(viewingCats === "active"
            ? activeCats
            : inactiveCats
            ).length === 0 ? (
            <p>
                No{" "}
                {viewingCats === "active"
                ? "active"
                : "inactive"}{" "}
                cats found.
            </p>
            ) : (
            <ul>
                {(viewingCats === "active"
                ? activeCats
                : inactiveCats
                ).map((cat) => (
                <li key={cat.id}>
                    <strong>
                    {cat.name ?? "Unnamed cat"}
                    </strong>

                    {cat.lastSpottedLocation && (
                    <span>
                        {" "}
                        - {cat.lastSpottedLocation}
                    </span>
                    )}
                </li>
                ))}
            </ul>
            )}
        </div>
        )}
    </section>
  );
}