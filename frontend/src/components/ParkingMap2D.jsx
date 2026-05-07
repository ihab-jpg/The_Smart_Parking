import {
  ELEVATOR_SPOT_NUMBERS,
  EXIT_SPOT_NUMBERS_BY_LEVEL,
  REMOVED_SPOT_NUMBERS,
  STATUS_STYLES,
  buildMapLanes,
} from '../utils/parking';

const ROAD_SURFACE =
  'border border-brand-100/80 bg-white shadow-[inset_0_0_10px_rgba(52,78,58,0.08)]';
const AISLE_WIDTH = 'w-[56px] lg:w-[66px]';

function getSpotNumber(spot) {
  return Number(spot.label.split('-')[1]);
}

function getLevelPrefix(level) {
  return String.fromCharCode(64 + Number(level.slice(1)));
}

function formatSlotLabel(level, slotNumber) {
  return `${getLevelPrefix(level)}-${String(slotNumber).padStart(3, '0')}`;
}

function withDisplayDetails(spot, details) {
  if (spot?.kind === 'facility') {
    const { displayLabel, ...facilityDetails } = details;
    return { ...spot, ...facilityDetails };
  }

  if (!spot) {
    return spot;
  }

  return {
    ...spot,
    ...details,
    label: details.displayLabel || spot.label,
  };
}

function numberRowSpots(spots, level, rowKey, numbering) {
  return spots.map((spot, slotIndex) => {
    if (!spot) {
      return spot;
    }

    const slotPosition = slotIndex + 1;
    numbering.current += 1;
    const layoutPosition = numbering.current;

    if (spot.kind === 'facility') {
      return {
        ...spot,
        rowKey,
        rowPosition: slotPosition,
        slotPosition,
        layoutPosition,
      };
    }

    return withDisplayDetails(spot, {
      displayLabel: formatSlotLabel(level, layoutPosition),
      rowKey,
      rowPosition: slotPosition,
      slotPosition,
      layoutPosition,
    });
  });
}

function SpotCell({ spot, isActive, onSpotClick, orientation = 'horizontal' }) {
  const isVertical = orientation === 'vertical';
  const baseSize = isVertical
    ? 'h-[88px] w-8 lg:h-[96px] lg:w-9'
    : 'h-7 w-[104px] lg:h-8 lg:w-[114px]';

  if (!spot) {
    return <div className={`${baseSize} rounded-xl border border-dashed border-neutral-200 bg-white/70`} />;
  }

  if (spot.kind === 'facility') {
    return (
      <div
        title={spot.displayLabel || spot.label}
        className={`flex ${baseSize} items-center justify-center rounded-xl border border-neutral-200 bg-[linear-gradient(180deg,#f7f8f5_0%,#ecefe8_100%)] px-2 text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-500 shadow-inner lg:text-[9px]`}
      >
        <span className={isVertical ? '-rotate-90 whitespace-nowrap' : 'whitespace-nowrap'}>
          {spot.displayLabel || spot.label}
        </span>
      </div>
    );
  }

  const style = STATUS_STYLES[spot.status] || STATUS_STYLES.available;

  if (!isActive) {
    return (
      <div
        className={`flex ${baseSize} select-none items-center justify-center rounded-xl border border-neutral-200 border-dashed bg-white px-2 text-[9px] font-bold tracking-[0.12em] text-neutral-300 opacity-85 shadow-sm lg:text-[10px]`}
      >
        <span className={isVertical ? '-rotate-90 whitespace-nowrap' : ''}>
          {spot.displayLabel || spot.label}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSpotClick(spot)}
      title={`${spot.displayLabel || spot.label} - ${spot.status}`}
      className={`flex ${baseSize} items-center justify-center rounded-xl border px-2 text-[9px] font-bold tracking-[0.12em] shadow-sm transition duration-200 lg:text-[10px] ${style.card} hover:-translate-y-px hover:scale-[1.015] hover:shadow-soft`}
    >
      <span className={isVertical ? '-rotate-90 whitespace-nowrap' : ''}>
        {spot.displayLabel || spot.label}
      </span>
    </button>
  );
}

function HorizontalCirculationBand({ compact = false }) {
  const bandHeight = compact ? 'h-24 lg:h-24' : 'h-24 lg:h-24';

  return (
    <div className={bandHeight} />
  );
}

function ConnectedRoadLayer() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[136px] bottom-[112px] z-0">
      <svg
        className="h-full w-full overflow-visible"
        viewBox="0 0 920 1180"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="roadShadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#3f5f45" floodOpacity="0.08" />
          </filter>
        </defs>
        <path
          d="M 88 30 H 832 M 241 30 V 1150 M 679 30 V 1150 M 88 1150 H 832"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="46"
          filter="url(#roadShadow)"
        />
        <path
          d="M 88 30 H 832 M 241 30 V 1150 M 679 30 V 1150 M 88 1150 H 832"
          fill="none"
          stroke="#d9e7d8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="48"
          opacity="0.45"
        />
        <path
          d="M 88 30 H 832 M 241 30 V 1150 M 679 30 V 1150 M 88 1150 H 832"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="42"
        />
      </svg>
    </div>
  );
}

function AisleColumn({ variant = 'drive' }) {
  const radiusClass = 'rounded-[32px]';
  const widthClass = variant === 'divider' ? 'w-[58px] lg:w-[72px]' : AISLE_WIDTH;

  if (variant === 'divider') {
    return (
      <div className="flex justify-center self-stretch">
        <div className={`${widthClass} ${radiusClass} relative min-h-[1180px] overflow-hidden bg-transparent`}>
          <div className={`${radiusClass} absolute inset-0 border-[3px] border-neutral-500/75 shadow-sm`} />
          <div className={`${radiusClass} absolute inset-[6px] border border-white/60`} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center self-stretch">
      <div
        className={`${widthClass} ${radiusClass} min-h-[1180px] bg-transparent`}
      />
    </div>
  );
}

function VerticalSpotRow({ spots, filteredSpotIds, onSpotClick }) {
  return (
    <div className="flex items-end justify-center gap-1.5 lg:gap-2">
      {spots.filter(Boolean).map((spot) => (
        <SpotCell
          key={spot.id}
          spot={spot}
          isActive={filteredSpotIds.has(spot.id)}
          onSpotClick={onSpotClick}
          orientation="vertical"
        />
      ))}
    </div>
  );
}

function LaneColumn({ spots, filteredSpotIds, onSpotClick, align }) {
  const justify =
    align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';

  return (
    <div className="relative z-10">
      <div className={`flex flex-col gap-1.5 lg:gap-2 ${justify}`}>
        {spots.filter(Boolean).map((spot) => (
          <SpotCell
            key={spot.id}
            spot={spot}
            isActive={filteredSpotIds.has(spot.id)}
            onSpotClick={onSpotClick}
          />
        ))}
      </div>
    </div>
  );
}

function splitLaneSections(lane) {
  return {
    top: lane.spots.slice(0, 5),
    middle: lane.spots.slice(5, 45),
    bottom: lane.spots.slice(45, 50),
  };
}

export default function ParkingMap2D({ level, spots, filteredSpotIds, onSpotClick }) {
  const layoutSpots = spots.map((spot) => {
    const spotNumber = getSpotNumber(spot);

    if (REMOVED_SPOT_NUMBERS.has(spotNumber)) {
      return null;
    }

    if (ELEVATOR_SPOT_NUMBERS.has(spotNumber)) {
      return {
        id: `${level}-elevator-${spotNumber}`,
        kind: 'facility',
        label: 'Elevator',
      };
    }

    if (EXIT_SPOT_NUMBERS_BY_LEVEL[level]?.has(spotNumber)) {
      return {
        id: `${level}-exit-${spotNumber}`,
        kind: 'facility',
        label: 'Exit',
      };
    }

    return spot;
  });
  const laneSections = buildMapLanes(layoutSpots, 4, 50).map((lane, laneIndex) => {
    const sections = splitLaneSections(lane);

    return {
      top: sections.top,
      middle: sections.middle,
      bottom: sections.bottom,
      rowKey: `${level}-lane-${laneIndex + 1}`,
    };
  });
  const numbering = { current: 0 };
  const topRowSpots = numberRowSpots(
    laneSections.flatMap((lane) => lane.top),
    level,
    `${level}-top`,
    numbering,
  );
  laneSections.forEach((lane) => {
    lane.middle = numberRowSpots(lane.middle, level, lane.rowKey, numbering);
  });
  const bottomRowSpots = numberRowSpots(
    laneSections.flatMap((lane) => lane.bottom),
    level,
    `${level}-bottom`,
    numbering,
  );
  const visibleSpots = spots.filter(
    (spot) =>
      !REMOVED_SPOT_NUMBERS.has(getSpotNumber(spot)) &&
      !ELEVATOR_SPOT_NUMBERS.has(getSpotNumber(spot)) &&
      !EXIT_SPOT_NUMBERS_BY_LEVEL[level]?.has(getSpotNumber(spot)) &&
      filteredSpotIds.has(spot.id),
  );
  const available = visibleSpots.filter((spot) => spot.status === 'available').length;
  const occupied = visibleSpots.filter((spot) => spot.status === 'occupied').length;
  const reserved = visibleSpots.filter((spot) => spot.status === 'reserved').length;
  const accessible = visibleSpots.filter((spot) => spot.status === 'suspended').length;
  const middleGridTemplate = '114px 66px 114px 64px 114px 66px 114px';

  return (
    <div className="rounded-[30px] border border-neutral-200 bg-gradient-to-b from-[#f8faf7] to-[#f2f5ef] p-4 shadow-soft lg:p-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <div className="rounded-[24px] border border-emerald-200 bg-white/85 px-4 py-4 text-center shadow-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Available
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{available}</p>
        </div>
        <div className="rounded-[24px] border border-rose-200 bg-white/85 px-4 py-4 text-center shadow-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
            Occupied
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{occupied}</p>
        </div>
        <div className="rounded-[24px] border border-amber-200 bg-white/85 px-4 py-4 text-center shadow-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            Under Maintenance
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{reserved}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white/85 px-4 py-4 text-center shadow-soft">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Accessible Parking
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{accessible}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[30px] border border-neutral-200 bg-white p-4 shadow-soft lg:mt-6 lg:p-5">
        <div className="rounded-[28px] border border-dashed border-brand-200 bg-[linear-gradient(180deg,#fbfdf9_0%,#f7faf5_100%)] p-4 lg:p-5">
          <div className="mx-auto overflow-x-auto">
            <div className="relative mx-auto w-fit min-w-[920px]">
              <ConnectedRoadLayer />

              <div className="relative z-10 mx-auto w-fit">
                <div className="mt-9 grid grid-cols-[1fr] items-end">
                  <div className="flex justify-center">
                    <VerticalSpotRow
                      spots={topRowSpots}
                      filteredSpotIds={filteredSpotIds}
                      onSpotClick={onSpotClick}
                    />
                  </div>
                </div>

                <div className="mt-7">
                  <HorizontalCirculationBand compact />
                </div>
              </div>

              <div
                className="relative z-10 mt-4 grid items-start justify-center gap-x-5"
                style={{ gridTemplateColumns: middleGridTemplate }}
              >
                <LaneColumn
                  spots={laneSections[0].middle}
                  filteredSpotIds={filteredSpotIds}
                  onSpotClick={onSpotClick}
                  align="end"
                />
                <AisleColumn />
                <LaneColumn
                  spots={laneSections[1].middle}
                  filteredSpotIds={filteredSpotIds}
                  onSpotClick={onSpotClick}
                  align="start"
                />
                <AisleColumn variant="divider" />
                <LaneColumn
                  spots={laneSections[2].middle}
                  filteredSpotIds={filteredSpotIds}
                  onSpotClick={onSpotClick}
                  align="start"
                />
                <AisleColumn />
                <LaneColumn
                  spots={laneSections[3].middle}
                  filteredSpotIds={filteredSpotIds}
                  onSpotClick={onSpotClick}
                  align="end"
                />
              </div>

              <div className="relative z-10 mx-auto mt-4 w-fit">
                <div>
                  <HorizontalCirculationBand compact />
                </div>

                <div className="mt-2 grid grid-cols-[1fr] items-start">
                  <div className="flex justify-center">
                    <VerticalSpotRow
                      spots={bottomRowSpots}
                      filteredSpotIds={filteredSpotIds}
                      onSpotClick={onSpotClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
