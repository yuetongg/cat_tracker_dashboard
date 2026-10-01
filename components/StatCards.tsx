type Props = {
  totalCats: number;
  activeCats: number | null;
  inactiveCats: number | null;
  feedingCount: number | null;
};

export default function StatCards({
  totalCats,
  activeCats,
  inactiveCats,
  feedingCount,
}: Props) {
  return (
    <section>
      <div>
        <h2>Total Cats</h2>
        <p>{totalCats}</p>
      </div>

      <div>
        <h2>Active</h2>
        <p>{activeCats ?? "-"}</p>
      </div>

      <div>
        <h2>Inactive</h2>
        <p>{inactiveCats ?? "-"}</p>
      </div>

      <div>
        <h2>Feedings</h2>
        <p>{feedingCount ?? "-"}</p>
      </div>
    </section>
  );
}