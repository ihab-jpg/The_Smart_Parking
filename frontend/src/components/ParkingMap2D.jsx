import { STATUS_STYLES, buildMapLanes } from '../utils/parking';

<<<<<<< HEAD
const REMOVED_SPOT_NUMBERS = new Set([1, 2, 3, 46, 47, 48, 153, 154, 155, 198, 199, 200]);
const ROAD_SURFACE =
  'border border-brand-100/80 bg-gradient-to-b from-white via-[#fbfcfa] to-[#f4f7f2] shadow-inner';
const AISLE_WIDTH = 'w-[72px] lg:w-[88px]';

function getSpotNumber(spot) {
  return Number(spot.label.split('-')[1]);
}

function SpotCell({ spot, isActive, onSpotClick, orientation = 'horizontal' }) {
  const isVertical = orientation === 'vertical';
  const baseSize = isVertical
    ? 'h-[88px] w-8 lg:h-[96px] lg:w-9'
    : 'h-7 w-[104px] lg:h-8 lg:w-[114px]';

  if (!spot) {
    return <div className={`${baseSize} rounded-xl border border-dashed border-neutral-200 bg-white/70`} />;
  }

  const style = STATUS_STYLES[spot.status] || STATUS_STYLES.available;

  return (
    <button
      type="button"
      onClick={() => onSpotClick(spot)}
      title={`${spot.label} - ${spot.status}`}
      disabled={!isActive}
      className={`flex ${baseSize} items-center justify-center rounded-xl border px-2 text-[9px] font-bold tracking-[0.12em] shadow-sm transition duration-200 lg:text-[10px] ${
        isActive
          ? `${style.card} hover:-translate-y-px hover:scale-[1.015] hover:shadow-soft`
          : 'border-neutral-200 border-dashed bg-white text-neutral-300 opacity-85'
      }`}
    >
      <span className={isVertical ? '-rotate-90 whitespace-nowrap' : ''}>{spot.label}</span>
    </button>
  );
}

function HorizontalCirculationBand({ compact = false }) {
  const bandHeight = compact ? 'h-8 lg:h-9' : 'h-10 lg:h-12';
  const bandWidth = compact ? 'w-full max-w-[860px]' : 'w-full max-w-[920px]';

  return (
    <div className="flex justify-center">
      <div className={`${bandWidth} ${bandHeight} rounded-full ${ROAD_SURFACE}`} />
=======
function SpotCell({ spot, onSpotClick, align = 'center' }) {
  if (!spot) {
    return (
      <div className="h-5 w-[74px] rounded-md border border-dashed border-neutral-200 bg-white/70" />
    );
  }

  const style = STATUS_STYLES[spot.status] || STATUS_STYLES.available;
  const justify =
    align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center';

  return (
    <div className={`flex ${justify}`}>
      <button
        type="button"
        onClick={() => onSpotClick(spot)}
        title={`${spot.label} - ${spot.status}`}
        className={`flex h-5 w-[74px] items-center justify-center rounded-md border px-1 text-[7px] font-bold tracking-[0.03em] shadow-sm transition hover:scale-[1.02] hover:shadow-soft ${style.card}`}
      >
        {spot.label}
      </button>
>>>>>>> dd17e67 (Update frontend parking system UI)
    </div>
  );
}

<<<<<<< HEAD
function AisleColumn() {
  const radiusClass = 'rounded-[32px]';

  return (
    <div className="flex justify-center self-stretch">
      <div
        className={`${AISLE_WIDTH} ${radiusClass} min-h-[1180px] ${ROAD_SURFACE}`}
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
=======
function LaneColumn({ spots, onSpotClick, align }) {
  return (
    <div className="relative z-10 flex flex-col gap-1">
      {spots.map((spot, index) => (
        <SpotCell
          key={spot ? spot.id : `empty-${index}`}
          spot={spot}
          onSpotClick={onSpotClick}
          align={align}
>>>>>>> dd17e67 (Update frontend parking system UI)
        />
      ))}
    </div>
  );
}

<<<<<<< HEAD
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
=======
function AisleColumn({ variant = 'side' }) {
  const widthClass = variant === 'center' ? 'w-[58px] lg:w-[64px]' : 'w-4';
  const radiusClass = variant === 'center' ? 'rounded-[28px]' : 'rounded-full';

  return (
    <div className="flex justify-center self-stretch">
      <div
        className={`${widthClass} ${radiusClass} min-h-[1196px] border border-brand-100 bg-white`}
      />
>>>>>>> dd17e67 (Update frontend parking system UI)
    </div>
  );
}

<<<<<<< HEAD
function splitLaneSections(lane) {
  return {
    top: lane.spots.slice(0, 5),
    middle: lane.spots.slice(5, 45),
    bottom: lane.spots.slice(45, 50),
  };
}

export default function ParkingMap2D({ level, spots, filteredSpotIds, onSpotClick }) {
  const layoutSpots = spots.map((spot) =>
    REMOVED_SPOT_NUMBERS.has(getSpotNumber(spot)) ? null : spot,
  );
  const laneSections = buildMapLanes(layoutSpots, 4, 50).map(splitLaneSections);
  const topRowSpots = laneSections.flatMap((lane) => lane.top);
  const bottomRowSpots = laneSections.flatMap((lane) => lane.bottom);
  const visibleSpots = spots.filter(
    (spot) =>
      !REMOVED_SPOT_NUMBERS.has(getSpotNumber(spot)) && filteredSpotIds.has(spot.id),
  );
  const available = visibleSpots.filter((spot) => spot.status === 'available').length;
  const occupied = visibleSpots.filter((spot) => spot.status === 'occupied').length;
  const reserved = visibleSpots.filter((spot) => spot.status === 'reserved').length;
  const accessible = visibleSpots.filter((spot) => spot.status === 'suspended').length;
  const middleGridTemplate = '114px 88px 114px 88px 114px 88px 114px';

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
            <div className="mx-auto w-fit min-w-[920px]">
              <div className="mx-auto w-fit">
                <div className="grid grid-cols-[1fr] items-end">
                  <div className="flex justify-center">
                    <VerticalSpotRow
                      spots={topRowSpots}
                      filteredSpotIds={filteredSpotIds}
                      onSpotClick={onSpotClick}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <HorizontalCirculationBand compact />
                </div>
              </div>

              <div
                className="mt-4 grid items-start justify-center gap-x-5"
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
                <AisleColumn />
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

              <div className="mx-auto mt-4 w-fit">
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

=======
export default function ParkingMap2D({ level, spots, onSpotClick }) {
  const lanes = buildMapLanes(spots, 4, 50);

  return (
    <div className="rounded-[22px] border border-neutral-200 bg-neutral-50 p-3 lg:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-900">{level} parking map</p>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-500 shadow-soft">
          Tap any spot to inspect details
        </span>
      </div>

      <div className="rounded-[22px] border border-neutral-200 bg-white p-3 shadow-soft lg:p-4">
        <div className="rounded-[22px] border border-dashed border-brand-200 bg-[#fafcf9] p-3 lg:p-4">
          <div className="mx-auto w-fit">
            <div className="mb-5 flex justify-center">
              <div className="rounded-full border border-brand-200 bg-white px-8 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-soft">
                Vehicle Circulation Zone
              </div>
            </div>

            <div className="grid grid-cols-[78px_18px_78px_64px_78px_18px_78px] items-start gap-x-3">
              <LaneColumn spots={lanes[0].spots} onSpotClick={onSpotClick} align="end" />
              <AisleColumn />
              <LaneColumn spots={lanes[1].spots} onSpotClick={onSpotClick} align="start" />
              <AisleColumn variant="center" />
              <LaneColumn spots={lanes[2].spots} onSpotClick={onSpotClick} align="start" />
              <AisleColumn />
              <LaneColumn spots={lanes[3].spots} onSpotClick={onSpotClick} align="end" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-white px-3 py-1.5 text-emerald-700 shadow-soft">
              Available
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-rose-700 shadow-soft">
              Occupied
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-amber-700 shadow-soft">
              Under Maintenance
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-slate-700 shadow-soft">
              Suspended
            </span>
          </div>
>>>>>>> dd17e67 (Update frontend parking system UI)
        </div>
      </div>
    </div>
  );
}
