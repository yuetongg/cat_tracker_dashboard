"use client";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import DashboardFilters from "@/components/DashboardFilters";
import CatsByLocation from "@/components/CatsByLocation";
import { cycles } from "@/lib/cycles";
import { Cat } from "@/lib/types";
import { getLogsForCats } from "@/lib/catlogs";
import { catIsActiveInCycle, logIsInCycle } from "@/lib/cycleUtils";
import StatCards from "@/components/StatCards";

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
      <main>
        <h1>Cat Dashboard</h1>

        <button onClick={handleGoogleLogin}>
          Sign in with Google
        </button>

        {error && <p>{error}</p>}
      </main>
    );
  }

  return (
    <main>
      <h1>Cat Dashboard</h1>

      <p>
        Signed in as: <strong>{user.email}</strong>
      </p>

      <button onClick={handleLogout}>
        Sign out
      </button>
      <hr />

      <DashboardFilters
        selectedCycleId={selectedCycleId}
        onCycleChange={setSelectedCycleId}
      />    
      <StatCards
        totalCats={totalCats}
        activeCats={activeCats.length}
        inactiveCats={inactiveCats.length}
      />
      <CatsByLocation cats={cats} />
    </main>
  );
}

