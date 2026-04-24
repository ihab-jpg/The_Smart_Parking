import { STATUS_STYLES, getStatusLabel } from '../utils/parking';

export default function ParkingSpot({ spot, onClick }) {
  const style = STATUS_STYLES[spot.status] || STATUS_STYLES.available;

  return (
    <button
      type="button"
      onClick={() => onClick(spot)}
      className={`group rounded-[22px] border p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 ${style.card}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xl font-semibold">{spot.label}</span>
        <span className={`h-3.5 w-3.5 rounded-full ${style.dot}`} />
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
        {spot.type}
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        {spot.assignedTo ? `Assigned: ${spot.assignedTo}` : 'Tap for live details'}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-neutral-500">
        <span>{spot.level}</span>
        <span className="group-hover:text-neutral-800">{getStatusLabel(spot.status)}</span>
      </div>
    </button>
  );
}
