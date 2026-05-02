export default function LevelSummaryCard({ level, summary }) {
  return (
    <div className="rounded-[22px] border border-neutral-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">{level}</p>
        <p className="text-sm font-semibold text-brand-700">
          Availability {summary.availableRate}%
        </p>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-brand-600"
          style={{ width: `${summary.availableRate}%` }}
        />
      </div>
    </div>
  );
}
