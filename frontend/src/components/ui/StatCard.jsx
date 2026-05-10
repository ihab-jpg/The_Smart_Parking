export default function StatCard({ label, value, accent, detail }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-[0.7rem] shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-600">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
      <p className="mt-1 font-display text-[1.25rem] font-semibold leading-none text-neutral-900">
        {value}
      </p>
    </div>
  );
}
