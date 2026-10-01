type Cat = {
  id: string;
  name?: string;
  lastSpottedLocation?: string;
};

type Props = {
  cats: Cat[];
};

export default function CatsByLocation({ cats }: Props) {
  const catsByLocation: Record<string, number> = {};

  cats.forEach((cat) => {
    const location = cat.lastSpottedLocation || "Unknown";

    if (catsByLocation[location]) {
      catsByLocation[location]++;
    } else {
      catsByLocation[location] = 1;
    }
  });

  return (
    <section>
      <h2>Cats by Location</h2>

      {Object.entries(catsByLocation).map(([location, count]) => (
        <div key={location}>
          <strong>{location}</strong>: {count} cats
        </div>
      ))}
    </section>
  );
}