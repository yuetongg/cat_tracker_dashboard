"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Cat } from "@/lib/types";
import { getFeedingsByDate } from "@/lib/feedingUtils";

type Props = {
  cats: Cat[];
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
};

function formatDate(dateString: string) {
  if (!dateString) return "";

  const [year, month, day] =
    dateString.split("-");

  return `${day}/${month}/${year}`;
}

export default function FeedingCard({
  cats,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const data = getFeedingsByDate(
    cats,
    startDate,
    endDate
  );

  const locations = new Set<string>();

  data.forEach((day) => {
    Object.keys(day).forEach((key) => {
      if (key !== "date") {
        locations.add(key);
      }
    });
  });

  const totalFeedings = data.reduce(
    (total, day) => {
      return (
        total +
        Object.entries(day).reduce(
          (dayTotal, [key, value]) => {
            if (key === "date") {
              return dayTotal;
            }

            return dayTotal + Number(value);
          },
          0
        )
      );
    },
    0
  );

  return (
    <section>
      <h2>Feeding Activity</h2>

      <div>
        <label htmlFor="feeding-start">
          From:{" "}
        </label>

        <input
          id="feeding-start"
          type="date"
          value={startDate}
          onChange={(e) =>
            onStartDateChange(e.target.value)
          }
        />

        <label htmlFor="feeding-end">
          {" "}To:{" "}
        </label>

        <input
          id="feeding-end"
          type="date"
          value={endDate}
          onChange={(e) =>
            onEndDateChange(e.target.value)
          }
        />
      </div>

      <div>
        <p>Total feedings</p>
        <p>{totalFeedings}</p>
      </div>

      {data.length > 0 ? (
        <BarChart
          width={600}
          height={300}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
          />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Legend />

          {Array.from(locations).map(
            (location) => (
              <Bar
                key={location}
                dataKey={location}
                stackId="feeding"
              />
            )
          )}
        </BarChart>
      ) : (
        <p>No feeding activity found.</p>
      )}
    </section>
  );
}