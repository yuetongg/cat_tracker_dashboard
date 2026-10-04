"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  Center,
  Loader,
  Text,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { Cat } from "@/lib/types";
import { getLogsForCats } from "@/lib/catlogs";
import { cycles } from "@/lib/cycles";
import CatList from "@/components/CatList";

export default function CatsPage() {
  const searchParams = useSearchParams();

  const alert = searchParams.get("alert");
  const status = searchParams.get("status");
  const cycleId = searchParams.get("cycle");

  const [user, setUser] = useState<User | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadCats() {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          collection(db, "cats")
        );

        const catData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Cat[];

        const catsWithLogs =
          await getLogsForCats(catData);

        setCats(catsWithLogs);
      } catch (error) {
        console.error(
          "Failed to load cats:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCats();
  }, [user]);

  if (!user) {
    return (
      <Center mih="100vh">
        <Text>
          Please sign in to view the cats.
        </Text>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  const selectedCycle =
    cycles.find((cycle) => cycle.id === cycleId) ??
    null;

  return (
    <CatList
      cats={cats}
      initialAlert={
        alert === "injured"
          ? "injured"
          : alert === "not-seen"
            ? "not-seen"
            : null
      }
      initialStatus={
        status === "active"
          ? "active"
          : status === "inactive"
            ? "inactive"
            : null
      }
      initialCycle={selectedCycle}
    />
  );
}
