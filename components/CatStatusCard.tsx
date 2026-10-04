"use client";

import ReactECharts from "echarts-for-react";

import {
  Card,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { cycles } from "@/lib/cycles";
import { Cat } from "@/lib/types";

type Props = {
  selectedCycleId: string;
  onCycleChange: (cycleId: string) => void;
  totalCats: number;
  activeCats: Cat[];
  inactiveCats: Cat[];
};

function formatDate(dateString: string) {
  const [year, month, day] =
    dateString.split("-");

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

  const cycleOptions = cycles.map((cycle) => ({
    value: cycle.id,
    label: `${cycle.name} (${formatDate(
      cycle.start
    )} – ${formatDate(cycle.end)})`,
  }));

  const donutOption = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} cats ({d}%)",
  },

  series: [
    {
      name: "Cat Status",
      type: "pie",

      radius: ["60%", "90%"], // ring can grow now that labels are gone
      center: ["50%", "50%"],

      itemStyle: {
        borderRadius: 6,
        borderColor: "#ffffff",
        borderWidth: 3,
      },

      // Hide the outside labels (the counts are shown on the right)
      label: { show: false },
      labelLine: { show: false },

      // On hover, show "Active 20" in the middle of the donut
      emphasis: {
        label: {
          show: true,
          position: "center",
          formatter: "{b}\n{c}",
          fontSize: 16,
          fontWeight: 700,
        },
      },

      data: [
        {
          value: activeCats.length,
          name: "Active",
          itemStyle: { color: "#40c057" },
        },
        {
          value: inactiveCats.length,
          name: "Inactive",
          itemStyle: { color: "#fa5252" },
        },
      ],
    },
  ],
};

  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      p="lg"
    >
      <Stack gap="md">

        {/* Header */}
        <Group
          justify="space-between"
          align="flex-start"
        >
          <div>
            <Title order={2} size="h3">
              Cat Status
            </Title>

            <Text
              size="sm"
              c="dimmed"
              mt={4}
            >
              Cat activity during an
              operational cycle
            </Text>
          </div>

          <Select
            label="Cycle"
            placeholder="Select a cycle"
            value={
              selectedCycleId || null
            }
            onChange={(value) =>
              onCycleChange(value ?? "")
            }
            data={cycleOptions}
            w={230}
            clearable
          />
        </Group>

        {!selectedCycle ? (
          <Card
            withBorder
            radius="md"
            p="xl"
            bg="gray.0"
          >
            <Text
              ta="center"
              c="dimmed"
            >
              Select a cycle to view
              cat status.
            </Text>
          </Card>
        ) : (
          <Group
            align="center"
            justify="center"
            gap="xl"
            wrap="nowrap"
          >
            {/* Donut */}
            <ReactECharts
              option={donutOption}
              style={{
                width: 220,
                height: 220,
              }}
              opts={{
                renderer: "canvas",
              }}
            />

            {/* Summary */}
            <Stack gap="sm">
              <div>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  Total Cats
                </Text>

                <Text
                  fw={700}
                  size="1.8rem"
                >
                  {totalCats}
                </Text>
              </div>

              <div>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  Active
                </Text>

                <Text
                  fw={700}
                  size="1.4rem"
                  c="green"
                >
                  {activeCats.length}
                </Text>
              </div>

              <div>
                <Text
                  size="sm"
                  c="dimmed"
                >
                  Inactive
                </Text>

                <Text
                  fw={700}
                  size="1.4rem"
                  c="red"
                >
                  {inactiveCats.length}
                </Text>
              </div>
            </Stack>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
