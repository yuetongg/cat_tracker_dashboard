import { collection, getDocs } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Cat, CatLog } from "./types";

export async function getCatLogs(catId: string): Promise<CatLog[]> {
  const snapshot = await getDocs(
    collection(db, "cats", catId, "logs")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as CatLog[];
}

export async function getLogsForCats(cats: Cat[]) {
  return Promise.all(
    cats.map(async (cat) => ({
      ...cat,
      logs: await getCatLogs(cat.id),
    }))
  );
}