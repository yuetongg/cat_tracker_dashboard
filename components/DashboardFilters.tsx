import { cycles } from "@/lib/cycles";

type Props = {
  selectedCycleId: string;
  onCycleChange: (cycleId: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export default function DashboardFilters({
  selectedCycleId,
  onCycleChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
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
            {cycle.name} ({formatDate(cycle.start)} - {formatDate(cycle.end)})
          </option>
        ))}
      </select>

      <div>
  <label htmlFor="startDate">From: </label>

  <input
    id="startDate"
    type="date"
    value={startDate}
    onChange={(e) => onStartDateChange(e.target.value)}
  />

  <label htmlFor="endDate"> To: </label>

  <input
    id="endDate"
    type="date"
    value={endDate}
    onChange={(e) => onEndDateChange(e.target.value)}
  />
</div>

      
    </section>
  );
}