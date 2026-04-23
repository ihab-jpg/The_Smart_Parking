<<<<<<< HEAD
const entranceOptions = [
  {
    value: 'fountain',
    label: 'Upper Gate',
    detail: '',
  },
  {
    value: 'civicCenter',
    label: 'Civic Center',
    detail: '',
  },
  {
    value: 'healthSciencesCenter',
    label: 'Health Sciences Center',
    detail: '',
  },
];

const quickExitOptions = [
  {
    value: 'scienceBldg',
    label: 'Science Bldg.',
    detail: 'L5 only',
  },
  {
    value: 'upperGate',
    label: 'Upper Gate',
    detail: 'L1 only',
  },
];

function TogglePill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-left text-sm font-semibold transition ${
        active
          ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-200 hover:bg-brand-50'
      }`}
    >
      {children}
    </button>
  );
}

function SelectableCard({ active, disabled = false, onClick, label, detail }) {
  const detailClass = disabled
    ? 'text-neutral-400'
    : active
      ? 'text-brand-700'
      : 'text-neutral-500';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        disabled
          ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400'
          : active
            ? 'border-brand-600 bg-brand-50 text-brand-800 shadow-soft'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-200 hover:bg-brand-50'
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className={`mt-1 text-xs ${detailClass}`}>{detail}</p>
    </button>
  );
}

export default function Sidebar({
  role,
  activeLevel,
  levels,
  onLevelChange,
  filters,
  onFiltersChange,
  quickExitAvailability,
}) {
  return (
    <aside className="space-y-5">
      <div className="surface-card rounded-[28px] p-5">
=======
const navItems = {
  ADMIN: ['Operations overview', 'Official assignments', 'Maintenance control', 'Level management'],
  USER: ['Live parking map', 'Spot details', 'Campus arrival', 'Quick navigation'],
};

export default function Sidebar({ role, activeLevel, levels, onLevelChange }) {
  return (
    <aside className="space-y-5">
      <div className="surface-card rounded-[28px] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
          {role === 'ADMIN' ? 'Admin workspace' : 'User workspace'}
        </p>
        <div className="mt-4 space-y-2">
          {navItems[role].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card rounded-[28px] p-5">
>>>>>>> dd17e67 (Update frontend parking system UI)
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Parking levels
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900">Select a floor</h3>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Active {activeLevel}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onLevelChange(level)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                activeLevel === level
                  ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-200 hover:bg-brand-50'
              }`}
            >
              <span>{level}</span>
              <span className="text-xs uppercase tracking-[0.18em]">
                {activeLevel === level ? 'selected' : 'view'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card rounded-[28px] p-5">
<<<<<<< HEAD
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Smart filters
            </p>
            <h3 className="mt-2 text-lg font-semibold text-neutral-900">Refine visible spots</h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-500 shadow-soft">
            {activeLevel}
          </span>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Spot status
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <TogglePill
                active={filters.availableOnly}
                onClick={() =>
                  onFiltersChange({ availableOnly: !filters.availableOnly })
                }
              >
                Available Only
              </TogglePill>
              <TogglePill
                active={filters.easyParking}
                onClick={() =>
                  onFiltersChange({ easyParking: !filters.easyParking })
                }
              >
                Easy Parking
              </TogglePill>
            </div>
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Easy Parking shows only available runs with at least two neighboring spots.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Near area
            </p>
            <div className="mt-3 grid gap-2">
              {entranceOptions.map((option) => (
                <SelectableCard
                  key={option.value}
                  active={filters.entrance === option.value}
                  onClick={() =>
                    onFiltersChange({
                      entrance: filters.entrance === option.value ? null : option.value,
                    })
                  }
                  label={option.label}
                  detail={option.detail}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Quick exit
            </p>
            <div className="mt-3 grid gap-2">
              {quickExitOptions.map((option) => (
                <SelectableCard
                  key={option.value}
                  active={filters.quickExit === option.value}
                  disabled={!quickExitAvailability[option.value]}
                  onClick={() =>
                    onFiltersChange({
                      quickExit: filters.quickExit === option.value ? null : option.value,
                    })
                  }
                  label={option.label}
                  detail={option.detail}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                availableOnly: false,
                easyParking: false,
                entrance: null,
                quickExit: null,
              })
            }
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-brand-200 hover:bg-brand-50"
          >
            Clear filters
          </button>
        </div>
=======
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
          Campus note
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          {role === 'ADMIN'
            ? 'Use this panel to switch levels quickly while reviewing assignments, occupancy, and maintenance changes.'
            : 'Choose a level to explore current availability and inspect spot details across campus.'}
        </p>
>>>>>>> dd17e67 (Update frontend parking system UI)
      </div>
    </aside>
  );
}
