"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Cat } from "@/lib/types";
import { useState } from "react";

type Props = {
  cats: Cat[];
};

export default function CatsByLocation({
  cats,
}: Props) {
  const [selectedLocations, setSelectedLocations] =
    useState<string[]>([]);

  const availableLocations = Array.from(
    new Set(
      cats.map(
        (cat) =>
          cat.lastSpottedLocation ?? "Unknown"
      )
    )
  ).sort();

  const filteredCats =
    selectedLocations.length === 0
      ? cats
      : cats.filter((cat) =>
          selectedLocations.includes(
            cat.lastSpottedLocation ?? "Unknown"
          )
        );

  const locations = new Map<string, number>();

  filteredCats.forEach((cat) => {
    const location =
      cat.lastSpottedLocation ?? "Unknown";

    locations.set(
      location,
      (locations.get(location) ?? 0) + 1
    );
  });

  const locationData = Array.from(
    locations.entries()
  )
    .map(([location, count]) => ({
      location,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  function handleLocationChange(
    location: string
  ) {
    setSelectedLocations((current) => {
      if (current.includes(location)) {
        return current.filter(
          (item) => item !== location
        );
      }

      return [...current, location];
    });
  }

  return (
    <section>
      <h2>Cats by Location</h2>

      <p>Block:</p>

      <div>
        {availableLocations.map((location) => (
          <label key={location}>
            <input
              type="checkbox"
              checked={selectedLocations.includes(
                location
              )}
              onChange={() =>
                handleLocationChange(location)
              }
            />

            {location}
          </label>
        ))}
      </div>

      {locationData.length > 0 ? (
        <BarChart
          width={600}
          height={300}
          data={locationData}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            allowDecimals={false}
          />

          <YAxis
            type="category"
            dataKey="location"
            width={150}
          />

          <Tooltip />

          <Bar dataKey="count" />
        </BarChart>
      ) : (
        <p>No cats found.</p>
      )}
    </section>
  );
}