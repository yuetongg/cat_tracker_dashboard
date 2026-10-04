"use client";

import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";import { Cat } from "@/lib/types";
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

  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

export default function FeedingCard({
  cats,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const data = getFeedingsByDate(cats, startDate, endDate);

  // Legend selection state: { [location]: boolean }
  // A location missing from this object is treated as selected.
  const [selectedLocations, setSelectedLocations] = useState<
    Record<string, boolean>
  >({});

  const locations = useMemo(() => {
    const result = new Set<string>();

    data.forEach((day) => {
      Object.keys(day).forEach((key) => {
        if (key !== "date") {
          result.add(key);
        }
      });
    });

    return Array.from(result);
  }, [data]);

  const activeLocations = useMemo(
    () => locations.filter((loc) => selectedLocations[loc] !== false),
    [locations, selectedLocations]
  );

  const totalFeedings = useMemo(() => {
    return data.reduce((total, day) => {
      return (
        total +
        activeLocations.reduce(
          (dayTotal, location) => dayTotal + Number(day[location] ?? 0),
          0
        )
      );
    }, 0);
  }, [data, activeLocations]);

  const rangeLabel =
    startDate || endDate
      ? `${startDate ? formatDate(startDate) : "Start"} – ${
          endDate ? formatDate(endDate) : "Today"
        }`
      : "All dates";

  const chartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any[]) => {
        if (!params?.length) return "";

        const date = params[0].axisValue;

        let result = `<strong>${formatDate(date)}</strong>`;

        params.forEach((item) => {
          if (Number(item.value) > 0) {
            result += `<br/>${item.marker} ${item.seriesName}: ${item.value}`;
          }
        });

        return result;
      },
    },

    legend: {
      bottom: 0,
      left: "center",
      type: "scroll",
      selected: selectedLocations,
    },

    grid: {
      left: 45,
      right: 20,
      top: 15,
      bottom: 55,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
      axisLabel: {
        formatter: (value: string) => dayjs(value).format("DD/MM"),
      },
      axisTick: {
        show: false,
      },
    },

    yAxis: {
      type: "value",
      minInterval: 1,
    },

    series: locations.map((location) => ({
      name: location,
      type: "bar",
      stack: "feeding",
      data: data.map((day) => Number(day[location] ?? 0)),
      barMaxWidth: 32,
      itemStyle: {
        borderRadius: 3,
      },
    })),
  };

  const chartEvents = {
    legendselectchanged: (event: { selected: Record<string, boolean> }) => {
      setSelectedLocations(event.selected);
    },
  };

 const dateRange: DatesRangeValue<string> = [
  startDate || null,
  endDate || null,
];

function handleDateRangeChange(value: DatesRangeValue<string>) {
  const [start, end] = value;

  onStartDateChange(start ?? "");
  onEndDateChange(end ?? "");
}
  return (
    <Card withBorder radius="md" shadow="sm" p="md">
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size="h3">
              Feeding Activity
            </Title>

            {/* Compact summary */}
            <Group gap={6} align="baseline" mt={2}>
              <Text fw={700} size="lg" lh={1}>
                {totalFeedings}
              </Text>
              <Text size="sm" c="dimmed">
                Total feedings
              </Text>
              {/* <Text size="xs" c="dimmed">
                · {rangeLabel}
              </Text> */}
            </Group>
          </div>

          <DatePickerInput
            type="range"
            placeholder="Select date range"
            value={dateRange}
            onChange={handleDateRangeChange}
            clearable
            allowSingleDateInRange
            valueFormat="DD/MM/YYYY"
            w={260}
          />
        </Group>

        {/* Chart */}
        {data.length > 0 ? (
          <ReactECharts
            option={chartOption}
            onEvents={chartEvents}
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
            No feeding activity found for this period.
          </Text>
        )}
      </Stack>
    </Card>
  );
}