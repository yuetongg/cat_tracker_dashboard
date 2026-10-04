"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { Cat } from "@/lib/types";

type Props = {
  cats: Cat[];
};

export default function CatAlertsCard({ cats }: Props) {
  const router = useRouter();

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

  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      p="lg"
    >
      <Stack gap="lg">
        <div>
          <Title order={2} size="h3">
            Cat Alerts
          </Title>

          <Text
            size="sm"
            c="dimmed"
            mt={4}
          >
            Cats requiring attention - click to view list of said cats
          </Text>
        </div>

        <SimpleGrid cols={2}>
          <Card
            withBorder
            radius="md"
            p="md"
            bg="red.0"
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              router.push("/cats?alert=injured")
            }
          >
            <Group
              justify="space-between"
              align="flex-start"
            >
              <div>
                <Text size="sm" c="dimmed">
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
            </Group>
          </Card>

          <Card
            withBorder
            radius="md"
            p="md"
            bg="orange.0"
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              router.push(
                "/cats?alert=not-seen"
              )
            }
          >
            <Group
              justify="space-between"
              align="flex-start"
            >
              <div>
                <Text size="sm" c="dimmed">
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
            </Group>
          </Card>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}