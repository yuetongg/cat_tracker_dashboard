"use client";

import { useState } from "react";
import { Cat } from "@/lib/types";
import CatDetailModal from "./CatDetailModal";

type Props = {
  cats: Cat[];
};

export default function CatAlertsCard({
  cats,
}: Props) {
  const [viewingCats, setViewingCats] = useState<
    "injured" | "notSeen" | null
  >(null);
  const [selectedCat, setSelectedCat] =
  useState<Cat | null>(null);

  const injuredCats = cats.filter(
    (cat) => cat.isInjured === true
  );

  const sevenDaysAgo =
    new Date().getTime() -
    7 * 24 * 60 * 60 * 1000;

  const notSeenCats = cats.filter((cat) => {
    if (!cat.lastSpotted) {
      return true;
    }

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
    <section>
      <h2>Cat Alerts</h2>

      <div>
        <div>
          <p>Injured</p>
          <p>{injuredCats.length}</p>
        </div>

        <div>
          <p>Not Seen &gt; 7 Days</p>
          <p>{notSeenCats.length}</p>
        </div>
      </div>

      <div>
        <button
          onClick={() =>
            setViewingCats("injured")
          }
        >
          View Injured Cats
        </button>

        <button
          onClick={() =>
            setViewingCats("notSeen")
          }
        >
          View Not Seen Cats
        </button>
      </div>

      {viewingCats && (
        <div>
          <h3>
            {viewingCats === "injured"
              ? "Injured Cats"
              : "Cats Not Seen for More Than 7 Days"}
          </h3>

          <button
            onClick={() => setViewingCats(null)}
          >
            Close
          </button>

          {catsToView.length === 0 ? (
            <p>No cats found.</p>
          ) : (
            <ul>
              {catsToView.map((cat) => (
                <li key={cat.id}>
                <button
                    onClick={() => setSelectedCat(cat)}
                >
                    <strong>
                    {cat.name ?? "Unnamed cat"}
                    </strong>

                    {cat.lastSpottedLocation && (
                    <span>
                        {" "}
                        - {cat.lastSpottedLocation}
                    </span>
                    )}
                </button>
                </li>
              ))
              }
            </ul>
          )}
        </div>
      )}
      <CatDetailModal
        cat={selectedCat}
        onClose={() => setSelectedCat(null)}
        />
    </section>
  );
}