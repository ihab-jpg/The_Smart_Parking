import Badge from './ui/Badge';
import { getStatusLabel } from '../utils/parking';

const statuses = ['available', 'occupied', 'reserved', 'suspended'];

export default function StatusLegend() {
  return (
<<<<<<< HEAD
    <div className="surface-card overflow-hidden rounded-[30px] border border-neutral-200/90 p-0">
      <div className="flex flex-col gap-5 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(245,248,243,0.92))] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Parking Status Legend
            </h3>
          </div>
          <div className="rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 shadow-soft">
            Live categories
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
=======
    <div className="surface-card rounded-[28px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Status legend</p>
          <p className="text-sm text-neutral-500">
            Green means open now, red means active occupancy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
>>>>>>> dd17e67 (Update frontend parking system UI)
          {statuses.map((status) => (
            <Badge key={status} status={status}>
              {getStatusLabel(status)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
