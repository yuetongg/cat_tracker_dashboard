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

type Cat = {
  id: string;
  name?: string;
  lastSpottedLocation?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      try {
        const snapshot = await getDocs(collection(db, "cats"));

        const catData: Cat[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Cat[];

        setCats(catData);
      } catch (err) {
        console.error(err);
        setError("Could not load cats.");
      }
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
  const catsByLocation: Record<string, number> = {};

  cats.forEach((cat) => {
    const location = cat.lastSpottedLocation || "Unknown";

    if (catsByLocation[location]) {
      catsByLocation[location]++;
    } else {
      catsByLocation[location] = 1;
    }
  });

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

      <h2>Cats by Location</h2>

      {Object.entries(catsByLocation).map(([location, count]) => (
        <div key={location}>
          <strong>{location}</strong>: {count} cats
        </div>
      ))}
    </main>
  );
}