"use client";

import {
  Button,
  Card,
  Center,
  Stack,
  Text,
  Title,
} from "@mantine/core";
type Props = {
  onLogin: () => void;
};

export default function LoginPage({
  onLogin,
}: Props) {
  return (
    <Center
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f1e8",
        padding: 24,
      }}
    >
      <Stack
        gap="xl"
        style={{
          width: "100%",
          maxWidth: 520,
        }}
      >
        {/* Branding */}
        <div>
          <Text
            fw={900}
            size="m"
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Boon Lay Youth Network
          </Text>

          <Title
            order={1}
            style={{
              fontSize:
                "clamp(2.5rem, 8vw, 4.5rem)",
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -2,
            }}
          >
            CAT
            <br />
            MONITORING
          </Title>
        </div>

        {/* Login card */}
        <Card
          withBorder
          radius={0}
          p="xl"
          style={{
            backgroundColor: "#ffffff",
            border:
              "3px solid #111111",
            boxShadow:
              "8px 8px 0 #111111",
          }}
        >
          <Stack gap="lg">
            <div>
              <Title
                order={2}
                size="h2"
                fw={900}
              >
                Welcome back! 🐈‍⬛
              </Title>

              <Text
                mt="xs"
                c="dimmed"
              >
                Sign in to let the cat out of the bag.
              </Text>
            </div>

            <Button
              fullWidth
              size="lg"
              radius={0}
              onClick={onLogin}
              style={{
                backgroundColor: "#5b8def",
                color: "#111111",
                border:
                  "3px solid #111111",
                boxShadow:
                  "5px 5px 0 #111111",
                fontWeight: 900,
                fontSize: 16,
              }}
            >
              SIGN IN WITH GOOGLE
            </Button>
          </Stack>
        </Card>

        {/* Footer */}
        <Text
          size="xs"
          fw={700}
          ta="center"
          c="#555555"
        >
          Authorised volunteers only
        </Text>
      </Stack>
      
    </Center>
    
  );
}
