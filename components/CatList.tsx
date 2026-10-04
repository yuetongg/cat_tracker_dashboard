"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Card,
  Group,
  Image,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { Cat } from "@/lib/types";
import CatDetailModal from "./CatDetailModal";

type AlertType = "injured" | "not-seen" | null;

type Props = {
  cats: Cat[];
  initialAlert: AlertType;
};

function formatLastSpotted(cat: Cat) {
  if (!cat.lastSpotted) {
    return "Never recorded";
  }

  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(cat.lastSpotted.toDate());
}
function toSgDay(date: Date) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
  })
    .format(date)
    .split("-")
    .map(Number);

  return Date.UTC(y, m - 1, d);
}

function getDaysAgo(cat: Cat): number | null {
  if (!cat.lastSpotted) return null;

  const diff =
    toSgDay(new Date()) - toSgDay(cat.lastSpotted.toDate());

  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

function formatDaysAgo(days: number) {
  if (days === 0) return "Seen today";
  if (days === 1) return "Seen yesterday";
  return `Seen ${days} days ago`;
}

function daysAgoColor(days: number) {
  if (days <= 2) return "green";
  if (days < 7) return "yellow";
  return "red";
}
export default function CatList({
  cats,
  initialAlert,
}: Props) {
  const [alertFilter, setAlertFilter] =
    useState<AlertType>(initialAlert);
    const router = useRouter();
  const [locations, setLocations] =
    useState<string[]>([]);

  const [feedingFilter, setFeedingFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [selectedCat, setSelectedCat] =
    useState<Cat | null>(null);

  const availableLocations = useMemo(() => {
    return Array.from(
      new Set(
        cats.map(
          (cat) =>
            cat.lastSpottedLocation ??
            "Unknown"
        )
      )
    ).sort();
  }, [cats]);

  const filteredCats = useMemo(() => {
    const sevenDaysAgo =
      Date.now() -
      7 * 24 * 60 * 60 * 1000;

    return cats.filter((cat) => {
      // Alert filter
      if (alertFilter === "injured") {
        if (cat.isInjured !== true) {
          return false;
        }
      }

      if (alertFilter === "not-seen") {
        if (
          cat.lastSpotted &&
          cat.lastSpotted.toDate().getTime() >=
            sevenDaysAgo
        ) {
          return false;
        }
      }

      // Location filter
      if (
        locations.length > 0 &&
        !locations.includes(
          cat.lastSpottedLocation ??
            "Unknown"
        )
      ) {
        return false;
      }

      // Feeding filter
      if (
        feedingFilter !== "all" &&
        cat.feedingStatus !== feedingFilter
      ) {
        return false;
      }

      // Search
      if (search.trim()) {
        const query =
          search.toLowerCase();

        const name =
          cat.name?.toLowerCase() ?? "";

        const location =
          cat.lastSpottedLocation?.toLowerCase() ??
          "";

        if (
          !name.includes(query) &&
          !location.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    cats,
    alertFilter,
    locations,
    feedingFilter,
    search,
  ]);

  return (
    <>
      <Stack
        p="xl"
        maw={1400}
        mx="auto"
      >
        {/* Header */}

        <Stack gap="sm">
        <button
            onClick={() => router.push("/")}
            style={{
            width: "fit-content",
            backgroundColor: "#fff",
            color: "#000",
            border: "3px solid #000",
            padding: "8px 14px",
            fontFamily:
                "Cascadia Mono, Consolas, monospace",
            fontWeight: 800,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 #000",
            }}
        >
            ← BACK TO DASHBOARD
        </button>

        <Group
            justify="space-between"
            align="flex-end"
        >
            <div>
            <Title order={1}>
                Cats
            </Title>

            <Text
                size="sm"
                c="dimmed"
                mt={4}
            >
                View and filter monitored community cats
            </Text>
            </div>

            <Text fw={700}>
            {filteredCats.length} cats
            </Text>
        </Group>
        </Stack>


        {/* Filters */}

        <Card
          withBorder
          radius="md"
          p="md"
        >
          <Group
            align="flex-end"
            grow
          >
            <Select
              label="Alert"
              placeholder="All cats"
              value={alertFilter}
              onChange={(value) =>
                setAlertFilter(
                  value as AlertType
                )
              }
              data={[
                {
                  value: "injured",
                  label: "Injured",
                },
                {
                  value: "not-seen",
                  label:
                    "Not Seen > 7 Days",
                },
              ]}
              clearable
            />

            <MultiSelect
            label="Location"
            placeholder="All locations"
            data={availableLocations}
            value={locations}
            onChange={setLocations}
            searchable
            clearable
            styles={{
                pill: {
                whiteSpace: "nowrap",
                flexShrink: 0,
                },
                pillsList: {
                flexWrap: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "thin",
                },
            }}
            />


            <Select
              label="Feeding"
              value={feedingFilter}
              onChange={(value) =>
                setFeedingFilter(
                  value ?? "all"
                )
              }
              data={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "fed",
                  label: "Fed",
                },
                {
                  value: "not_fed",
                  label: "Not Fed",
                },
              ]}
            />

            <TextInput
              label="Search"
              placeholder="Cat name or block"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.currentTarget.value
                )
              }
            />
          </Group>
        </Card>

        {/* Cats */}

        {filteredCats.length === 0 ? (
          <Card
            withBorder
            p="xl"
          >
            <Text
              ta="center"
              c="dimmed"
            >
              No cats match the selected filters.
            </Text>
          </Card>
        ) : (
          <SimpleGrid
            cols={{
              base: 1,
              md: 2,
            }}
          >
            {filteredCats.map((cat) => (
              <Card
                key={cat.id}
                withBorder
                radius="md"
                p={0}
                style={{
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onClick={() =>
                  setSelectedCat(cat)
                }
              >
                <Group
                  gap={0}
                  wrap="nowrap"
                  align="stretch"
                >
                  {/* Cat image */}

                  {cat.imageURL ? (
                    <Image
                      src={cat.imageURL}
                      alt={
                        cat.name ??
                        "Community cat"
                      }
                      w={180}
                      h={180}
                      fit="cover"
                    />
                  ) : (
                    <Stack
                      w={180}
                      h={180}
                      align="center"
                      justify="center"
                      bg="gray.1"
                    >
                      <Text
                        size="sm"
                        c="dimmed"
                      >
                        No photo
                      </Text>
                    </Stack>
                  )}

                  {/* Cat information */}

                  <Stack
                    p="md"
                    gap="xs"
                    style={{
                      flex: 1,
                    }}
                  >
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                    >
                      <Title
                        order={3}
                        size="h4"
                      >
                        {cat.name ??
                          "Unnamed cat"}
                      </Title>

                      {cat.isInjured && (
                        <Badge
                          color="red"
                          size="sm"
                        >
                          Injured
                        </Badge>
                      )}
                    </Group>

                    <Text
                      size="sm"
                      fw={600}
                    >
                      {cat.lastSpottedLocation ??
                        "Location unknown"}
                    </Text>

                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">
                        LAST SEEN
                      </Text>

                      <Text size="sm">
                        {formatLastSpotted(
                          cat
                        )}
                      </Text>
                    </Stack>

                    {cat.lastSpottedBy && (
                      <Text
                        size="xs"
                        c="dimmed"
                      >
                        Seen by:{" "}
                        <Text
                          span
                          c="inherit"
                        >
                          {cat.lastSpottedBy}
                        </Text>
                      </Text>
                    )}

                    <Group gap="xs" mt="auto">
                    <Badge
                        variant="light"
                        color={
                        cat.feedingStatus === "fed"
                            ? "green"
                            : "gray"
                        }
                    >
                        {cat.feedingStatus ?? "Unknown"}
                    </Badge>
                    {(() => {
                        const days = getDaysAgo(cat);

                        return (
                        <Badge
                            variant="light"
                            color={days === null ? "gray" : daysAgoColor(days)}
                        >
                            {days === null ? "Never seen" : formatDaysAgo(days)}
                        </Badge>
                        );
                    })()}

                    {cat.isInjured && (
                        <Badge variant="light" color="red">
                        Attention needed
                        </Badge>
                    )}
                    </Group>
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      {/* Full cat details */}

      <CatDetailModal
        cat={selectedCat}
        onClose={() =>
          setSelectedCat(null)
        }
      />
    </>
  );
}
