"use client";

import {
  Badge,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

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
    <Modal
      opened={!!cat}
      onClose={onClose}
      centered
      size="lg"
      withCloseButton
      title={
        <Group gap="sm">
          <Title
            order={2}
            style={{
              fontFamily:
                "Cascadia Mono, Consolas, monospace",
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            {cat.name ?? "Unnamed cat"}
          </Title>

          {cat.isInjured && (
            <Badge
              color="red"
              variant="filled"
              style={{
                border: "2px solid #000",
                boxShadow: "3px 3px 0 #000",
                fontWeight: 800,
              }}
            >
              INJURED
            </Badge>
          )}
        </Group>
      }
      overlayProps={{
        backgroundOpacity: 0.75,
      }}
      styles={{
        content: {
          backgroundColor: "#f5f5f0",
          color: "#111",
          border: "4px solid #000",
          borderRadius: 0,
          boxShadow: "10px 10px 0 #000",
        },

        header: {
          backgroundColor: "#f5f5f0",
          color: "#111",
          borderBottom: "4px solid #000",
          padding: "18px 22px",
          borderRadius: 0,
        },

        title: {
          width: "100%",
        },

        close: {
          color: "#000",
          backgroundColor: "#fff",
          border: "3px solid #000",
          borderRadius: 0,
          width: 38,
          height: 38,
          boxShadow: "3px 3px 0 #000",
        },

        body: {
          padding: 22,
        },
      }}
    >
      <Stack gap="lg">
        {/* Cat photo */}
        {cat.imageURL ? (
          <Image
            src={cat.imageURL}
            alt={
              cat.name ?? "Community cat"
            }
            h={280}
            fit="cover"
            radius={0}
            style={{
              border: "4px solid #000",
            }}
          />
        ) : (
          <Paper
            h={180}
            withBorder
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#deded8",
              border: "4px solid #000",
              borderRadius: 0,
              boxShadow: "6px 6px 0 #000",
            }}
          >
            <Text
              fw={800}
              size="sm"
              style={{
                fontFamily:
                  "Cascadia Mono, Consolas, monospace",
              }}
            >
              NO PHOTO
            </Text>
          </Paper>
        )}

        {/* Latest information */}
        <div>
          <Text
            size="sm"
            fw={900}
            mb="sm"
            style={{
              fontFamily:
                "Cascadia Mono, Consolas, monospace",
              letterSpacing: "0.05em",
            }}
          >
            // LATEST INFORMATION
          </Text>

          <Grid>
            <Grid.Col span={6}>
              <InfoBox
                label="LAST SEEN"
                value={formatDate(
                  cat.lastSpotted
                )}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <InfoBox
                label="LOCATION"
                value={
                  cat.lastSpottedLocation ??
                  "Unknown"
                }
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <InfoBox
                label="SEEN BY"
                value={
                  cat.lastSpottedBy ??
                  "Unknown"
                }
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Paper
                p="sm"
                style={{
                  backgroundColor: "#b8f2c8",
                  border: "3px solid #000",
                  borderRadius: 0,
                  boxShadow: "4px 4px 0 #000",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Text
                  size="xs"
                  fw={900}
                  style={{
                    fontFamily:
                      "Cascadia Mono, Consolas, monospace",
                  }}
                >
                  FEEDING
                </Text>

                <Badge
                  mt={6}
                  variant="filled"
                  color="dark"
                  radius={0}
                  style={{
                    border: "2px solid #000",
                  }}
                >
                  {cat.feedingStatus ??
                    "UNKNOWN"}
                </Badge>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>

        <Divider
          size="4px"
          color="black"
        />

        {/* Recent activity */}
        <div>
          <Group
            justify="space-between"
            mb="sm"
          >
            <Text
              size="sm"
              fw={900}
              style={{
                fontFamily:
                  "Cascadia Mono, Consolas, monospace",
                letterSpacing: "0.05em",
              }}
            >
              // RECENT ACTIVITY
            </Text>

            <Text
              size="xs"
              fw={700}
              c="dimmed"
            >
              LATEST 5 RECORDS
            </Text>
          </Group>

          {recentLogs.length === 0 ? (
            <Paper
              p="lg"
              style={{
                backgroundColor: "#deded8",
                border: "3px solid #000",
                borderRadius: 0,
                boxShadow: "4px 4px 0 #000",
              }}
            >
              <Text
                ta="center"
                fw={700}
              >
                No activity recorded.
              </Text>
            </Paper>
          ) : (
            <Stack gap="md">
              {recentLogs.map((log) => (
                <Paper
                  key={log.id}
                  p="md"
                  style={{
                    backgroundColor: log.isInjured
                      ? "#ffd6d6"
                      : "#fff",
                    border: "3px solid #000",
                    borderRadius: 0,
                    boxShadow: "5px 5px 0 #000",
                  }}
                >
                  <Group
                    justify="space-between"
                    align="flex-start"
                  >
                    <Text
                      size="sm"
                      fw={900}
                      style={{
                        fontFamily:
                          "Cascadia Mono, Consolas, monospace",
                      }}
                    >
                      {formatDate(
                        log.loggedAt
                      )}
                    </Text>

                    {log.isInjured && (
                      <Badge
                        radius={0}
                        color="red"
                        variant="filled"
                        style={{
                          border: "2px solid #000",
                          fontWeight: 900,
                        }}
                      >
                        INJURY
                      </Badge>
                    )}
                  </Group>

                  <Grid mt="sm">
                    <Grid.Col span={6}>
                      <LogField
                        label="LOCATION"
                        value={
                          log.location ??
                          "Unknown"
                        }
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <LogField
                        label="FEEDING"
                        value={
                          log.feedingStatus ??
                          "Unknown"
                        }
                      />
                    </Grid.Col>

                    <Grid.Col span={12}>
                      <LogField
                        label="SEEN BY"
                        value={
                          log.loggedBy ??
                          "Unknown"
                        }
                      />
                    </Grid.Col>
                  </Grid>

                  {log.notes && (
                    <Paper
                      mt="sm"
                      p="sm"
                      style={{
                        backgroundColor:
                          "#fff4a8",
                        border: "2px solid #000",
                        borderRadius: 0,
                      }}
                    >
                      <Text
                        size="xs"
                        fw={900}
                        mb={3}
                      >
                        NOTE
                      </Text>

                      <Text size="sm">
                        {log.notes}
                      </Text>
                    </Paper>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </div>
      </Stack>
    </Modal>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Paper
      p="sm"
      style={{
        backgroundColor: "#fff",
        border: "3px solid #000",
        borderRadius: 0,
        boxShadow: "4px 4px 0 #000",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Text
        size="xs"
        fw={900}
        style={{
          fontFamily:
            "Cascadia Mono, Consolas, monospace",
        }}
      >
        {label}
      </Text>

      <Text
        size="sm"
        fw={700}
        mt={5}
      >
        {value}
      </Text>
    </Paper>
  );
}

function LogField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack gap={2}>
      <Text
        size="xs"
        fw={900}
        c="dimmed"
      >
        {label}
      </Text>

      <Text
        size="sm"
        fw={700}
      >
        {value}
      </Text>
    </Stack>
  );
}
