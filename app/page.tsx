"use client";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  Button,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import CatsByLocation from "@/components/CatsByLocation";
import { cycles } from "@/lib/cycles";
import { Cat } from "@/lib/types";

import { getLogsForCats } from "@/lib/catlogs";
import { catIsActiveInCycle, logIsInCycle } from "@/lib/cycleUtils";
import CatStatusCard from "@/components/CatStatusCard";
import FeedingCard from "@/components/FeedingCard";
import CatAlertsCard from "@/components/CatAlertsCard";
import LoginPage from "@/components/LoginPage";
type CatLastSpotted = {
  id: string;
  name?: string;
  lastSpottedLocation?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const selectedCycle = cycles.find(
  (cycle) => cycle.id === selectedCycleId
);
  const totalCats = cats.length;

const activeCats = selectedCycle
  ? cats.filter((cat) =>
      catIsActiveInCycle(cat, selectedCycle)
    )
  : [];

const inactiveCats = selectedCycle
  ? cats.filter((cat) =>
      !catIsActiveInCycle(cat, selectedCycle)
    )
  : [];


  // Check login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  
  // Get cats
  useEffect(() => {
    if (!user) return;

 async function loadCats() {
  const snapshot = await getDocs(collection(db, "cats"));

  const catData = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Cat[];

  const catsWithLogs = await getLogsForCats(catData);

  setCats(catsWithLogs);
}

    loadCats();
  }, [user]);

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError("Google login failed.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setCats([]);
  }

  // Count cats by location


  if (loading) {
    return <main>Checking login...</main>;
  }

if (!user) {
  return (
    <LoginPage
      onLogin={handleGoogleLogin}
    />
  );
}

  return (
  <Container size="xl" py="xl">
    <Container size="xl" py="xl">
  <Stack gap="xl">

  <Group
  justify="space-between"
  align="flex-end"
>
  <div>
    <Text
      size="sm"
      c="dimmed"
      mb={4}
    >
      PS C:\cat-monitor&gt;
    </Text>

    <Title order={1}>
      CAT_MONITORING_DASHBOARD
    </Title>

    <Text
      c="dimmed"
      mt={4}
      size="sm"
    >
      "Thanks for looking out for our community cats."
    </Text>
  </div>

  <div>
    <Text
      size="sm"
      c="dimmed"
      ta="right"
    >
      SIGNED_IN_AS
    </Text>

    <Text
      size="sm"
      fw={500}
    >
      {user.email}
    </Text>

    <Button
      variant="subtle"
      color="powershell"
      size="xs"
      mt="xs"
      onClick={handleLogout}
    >
      [ SIGN_OUT ]
    </Button>
  </div>
</Group>

  <Group
  align="flex-start"
  grow
  gap="lg"
>
  {/* Left column */}
  <Stack gap="lg">
    <CatStatusCard
      selectedCycleId={selectedCycleId}
      onCycleChange={setSelectedCycleId}
      totalCats={totalCats}
      activeCats={activeCats}
      inactiveCats={inactiveCats}
    />

    <CatsByLocation cats={cats} />
  </Stack>

  {/* Right column */}
  <Stack gap="lg">
    <FeedingCard
      cats={cats}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
    />

    <CatAlertsCard cats={cats} />
  </Stack>
</Group>
  </Stack>
</Container>
  </Container>
);
}

