export default function StatCard({ label, value, accent, detail }) {
  return (
<<<<<<< HEAD
    <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-[0.7rem] shadow-soft">
=======
    <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-soft">
>>>>>>> dd17e67 (Update frontend parking system UI)
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-600">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
<<<<<<< HEAD
      <p className="mt-1 font-display text-[1.25rem] font-semibold leading-none text-neutral-900">
        {value}
      </p>
=======
      <p className="mt-4 font-display text-4xl font-semibold text-neutral-900">{value}</p>
      <p className="mt-2 text-sm text-neutral-500">{detail}</p>
>>>>>>> dd17e67 (Update frontend parking system UI)
    </div>
  );
}
