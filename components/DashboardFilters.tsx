import { cycles } from "@/lib/cycles";

type Props = {
  selectedCycleId: string;
  onCycleChange: (cycleId: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function DashboardFilters({
  selectedCycleId,
  onCycleChange,
  selectedDate,
  onDateChange,
}: Props) {
  const selectedCycle = cycles.find(
    (cycle) => cycle.id === selectedCycleId
  );

  return (
    <section>
      <label htmlFor="cycle">Cycle: </label>

      <select
        id="cycle"
        value={selectedCycleId}
        onChange={(e) => onCycleChange(e.target.value)}
      >
        <option value="">All Cycles</option>

        {cycles.map((cycle) => (
          <option key={cycle.id} value={cycle.id}>
            {cycle.name}
          </option>
        ))}
      </select>

      {selectedCycle && (
        <p>
          {formatDate(selectedCycle.start)} –{" "}
          {formatDate(selectedCycle.end)}
        </p>
      )}

      <label htmlFor="date">Date: </label>

      <input
        id="date"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </section>
  );
}