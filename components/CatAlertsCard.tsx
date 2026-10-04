"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { Cat } from "@/lib/types";
import CatDetailModal from "./CatDetailModal";

type Props = {
  cats: Cat[];
};

export default function CatAlertsCard({
  cats,
}: Props) {
  const [viewingCats, setViewingCats] =
    useState<"injured" | "notSeen" | null>(
      null
    );

  const [selectedCat, setSelectedCat] =
    useState<Cat | null>(null);

  const injuredCats = cats.filter(
    (cat) => cat.isInjured === true
  );

  const sevenDaysAgo =
    new Date().getTime() -
    7 * 24 * 60 * 60 * 1000;

  const notSeenCats = cats.filter((cat) => {
    if (!cat.lastSpotted) return true;

    return (
      cat.lastSpotted.toDate().getTime() <
      sevenDaysAgo
    );
  });

  const catsToView =
    viewingCats === "injured"
      ? injuredCats
      : notSeenCats;

  return (
    <>
      <Card
        withBorder
        radius="md"
        shadow="sm"
        p="lg"
      >
        <Stack gap="lg">

          {/* Header */}
          <div>
            <Title order={2} size="h3">
              Cat Alerts
            </Title>

            <Text
              size="sm"
              c="dimmed"
              mt={4}
            >
              Cats requiring attention
            </Text>
          </div>

          {/* Alert counts */}
          <SimpleGrid
            cols={{
              base: 2,
              sm: 2,
            }}
          >
            <Card
              withBorder
              radius="md"
              p="md"
              bg="red.0"
            >
              <Group
                justify="space-between"
                align="flex-start"
              >
                <div>
                  <Text
                    size="sm"
                    c="dimmed"
                  >
                    Injured
                  </Text>

                  <Text
                    fw={700}
                    size="2rem"
                    c="red.7"
                  >
                    {injuredCats.length}
                  </Text>
                </div>

                <Badge
                  color="red"
                  variant="light"
                >
                  Alert
                </Badge>
              </Group>
            </Card>

            <Card
              withBorder
              radius="md"
              p="md"
              bg="orange.0"
            >
              <Group
                justify="space-between"
                align="flex-start"
              >
                <div>
                  <Text
                    size="sm"
                    c="dimmed"
                  >
                    Not Seen &gt; 7 Days
                  </Text>

                  <Text
                    fw={700}
                    size="2rem"
                    c="orange.7"
                  >
                    {notSeenCats.length}
                  </Text>
                </div>

                <Badge
                  color="orange"
                  variant="light"
                >
                  Check
                </Badge>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Buttons */}
          

        </Stack>
      </Card>

      {/* Alert list modal */}
      <Modal
        opened={viewingCats !== null}
        onClose={() =>
          setViewingCats(null)
        }
        title={
          viewingCats === "injured"
            ? "Injured Cats"
            : "Cats Not Seen for More Than 7 Days"
        }
        centered
        size="md"
      >
        <Stack gap="xs">
          {catsToView.length === 0 ? (
            <Text c="dimmed">
              No cats found.
            </Text>
          ) : (
            catsToView.map((cat) => (
              <Button
                key={cat.id}
                variant="subtle"
                color="dark"
                justify="space-between"
                fullWidth
                onClick={() => {
                  setViewingCats(null);
                  setSelectedCat(cat);
                }}
              >
                <Group gap="xs">
                  <Text fw={600}>
                    {cat.name ??
                      "Unnamed cat"}
                  </Text>

                  {cat.lastSpottedLocation && (
                    <Text
                      size="sm"
                      c="dimmed"
                    >
                      {
                        cat.lastSpottedLocation
                      }
                    </Text>
                  )}
                </Group>
              </Button>
            ))
          )}
        </Stack>
      </Modal>

      {/* Cat detail */}
      <CatDetailModal
        cat={selectedCat}
        onClose={() =>
          setSelectedCat(null)
        }
      />
    </>
  );
}
