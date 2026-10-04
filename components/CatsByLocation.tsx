"use client";

import ReactECharts from "echarts-for-react";

import {
  Card,
  Group,
  MultiSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { Cat } from "@/lib/types";
import { useState } from "react";

type Props = {
  cats: Cat[];
};

export default function CatsByLocation({ cats }: Props) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const availableLocations = Array.from(
    new Set(cats.map((cat) => cat.lastSpottedLocation ?? "Unknown"))
  ).sort();

  const filteredCats =
    selectedLocations.length === 0
      ? cats
      : cats.filter((cat) =>
          selectedLocations.includes(cat.lastSpottedLocation ?? "Unknown")
        );

  const totalCatsInLocations = filteredCats.length;

  const locations = new Map<string, number>();

  filteredCats.forEach((cat) => {
    const location = cat.lastSpottedLocation ?? "Unknown";

    locations.set(location, (locations.get(location) ?? 0) + 1);
  });

  const locationData = Array.from(locations.entries())
    .map(([location, count]) => ({
      location,
      count,
    }))
    .sort((a, b) => b.count - a.count);

    const catLabel = totalCatsInLocations === 1 ? "cat" : "cats";

    const locationLabel =
      selectedLocations.length === 0
        ? "all locations"
        : `${selectedLocations.length} selected location${
            selectedLocations.length === 1 ? "" : "s"
          }`;

  const chartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    grid: {
      left: 120,
      right: 30,
      top: 10,
      bottom: 30,
    },

    xAxis: {
      type: "value",
      minInterval: 1,
    },

    yAxis: {
      type: "category",
      data: locationData.map((item) => item.location),
      axisTick: {
        show: false,
      },
    },

    series: [
      {
        type: "bar",
        data: locationData.map((item) => item.count),
        barMaxWidth: 28,

        itemStyle: {
          borderRadius: [0, 6, 6, 0],
        },

        label: {
          show: true,
          position: "right",
          fontWeight: 600,
        },
      },
    ],
  };

  return (
    <Card withBorder radius="md" shadow="sm" p="md">
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size="h3">
              Cats by Location
            </Title>

            {/* Compact summary */}
          <Group gap={6} align="baseline" mt={2}>
            <Text fw={700} size="lg" lh={1}>
              {totalCatsInLocations}
            </Text>
            <Text size="sm" c="dimmed">
              {catLabel} in {locationLabel}
            </Text>
          </Group>
          </div>

          <MultiSelect
            placeholder="All locations"
            data={availableLocations}
            value={selectedLocations}
            onChange={setSelectedLocations}
            clearable
            searchable
            w={240}
            size="sm"
            maxDropdownHeight={250}
            styles={{
              input: {
                overflow: "hidden",
              },
              pillsList: {
                flexWrap: "nowrap",
                overflow: "hidden",
              },
            }}
          />
        </Group>

        {/* Chart */}
        {locationData.length > 0 ? (
          <ReactECharts
            option={chartOption}
            style={{
              width: "100%",
              height: 260,
            }}
            opts={{
              renderer: "canvas",
            }}
          />
        ) : (
          <Text ta="center" c="dimmed" py="xl">
            No cats found for the selected locations.
          </Text>
        )}
      </Stack>
    </Card>
  );
}