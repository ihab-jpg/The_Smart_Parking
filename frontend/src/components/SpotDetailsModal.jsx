import { useState } from 'react';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { getStatusLabel } from '../utils/parking';

const nextStatuses = ['available', 'occupied', 'reserved', 'suspended'];

export default function SpotDetailsModal({
  role,
  spot,
  onClose,
  onStatusUpdate,
  onAssign,
}) {
  const [assignee, setAssignee] = useState(spot?.assignedTo || '');

  if (!spot) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-neutral-900/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-neutral-200 bg-white p-6 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{spot.level}</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-neutral-900">
              Spot {spot.label}
            </h3>
          </div>
          <Badge status={spot.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Type</p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">{spot.type}</p>
          </div>
          <div className="rounded-[22px] bg-neutral-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Assigned To</p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              {spot.assignedTo || 'Unassigned'}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-neutral-200 p-4">
          <p className="text-sm font-semibold text-neutral-900">Spring Boot ready DTO</p>
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-neutral-900 p-4 text-xs text-neutral-100">
{`{
  "id": ${spot.id},
  "label": "${spot.label}",
  "level": "${spot.level}",
  "status": "${spot.status}",
  "assignedTo": ${spot.assignedTo ? `"${spot.assignedTo}"` : 'null'},
  "type": "${spot.type}"
}`}
          </pre>
        </div>

        {role === 'ADMIN' ? (
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Update status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onStatusUpdate(spot.id, status)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition ${
                      spot.status === status
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-900">Assign to official</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={assignee}
                  onChange={(event) => setAssignee(event.target.value)}
                  placeholder="Example: Dean Office"
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-brand-400"
                />
                <Button onClick={() => onAssign(spot.id, assignee)}>Save Assignment</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] bg-brand-50 p-4 text-sm text-brand-900">
            Users can inspect live spot details here. Admin-only controls remain hidden until
            the backend role permissions are connected.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
