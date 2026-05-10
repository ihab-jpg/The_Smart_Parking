import { useEffect, useMemo, useRef, useState } from 'react';
import beirutGardenSage from '../assets/beirutGardenSage.avif';
import LevelSummaryCard from '../components/LevelSummaryCard';
import ParkingGrid from '../components/ParkingGrid';
import Sidebar from '../components/Sidebar';
import SpotDetailsModal from '../components/SpotDetailsModal';
import StatusLegend from '../components/StatusLegend';
import StatCard from '../components/ui/StatCard';
import { useParkingData } from '../hooks/useParkingData';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import * as operationsService from '../services/operationsService';
import * as parkingService from '../services/parkingService';
import {
  buildDashboardMetrics,
  findClosestAvailableSpot,
  findNearestLevelWithAvailableSpot,
  getFilteredSpotIds,
  getQuickExitAvailability,
  getLevelSummary,
} from '../utils/parking';

const defaultFilters = {
  availableOnly: false,
  entrance: null,
  easyParking: false,
  quickExit: null,
};

export default function DashboardPage() {
  const { session } = useAuth();
  const { levels, spots, loading, refreshSpots } = useParkingData();
  const [activeLevel, setActiveLevel] = useState('L1');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [profile, setProfile] = useState(null);
  const [operations, setOperations] = useState({
    summary: null,
    lots: [],
    reservations: [],
    admins: [],
    registeredSpots: [],
    disabilityVerifications: [],
    myDisabilityVerification: null,
  });
  const [documentUrl, setDocumentUrl] = useState('');
  const [operationsError, setOperationsError] = useState('');
  const [routeTarget, setRouteTarget] = useState(null);
  const [parkingGuidance, setParkingGuidance] = useState('');
  const [floorSuggestion, setFloorSuggestion] = useState(null);
  const [bulkStatusLoading, setBulkStatusLoading] = useState(false);
  const routeScrollTimeoutRef = useRef(null);

  const levelSpots = useMemo(
    () => spots.filter((spot) => spot.level === activeLevel),
    [activeLevel, spots],
  );
  const quickExitAvailability = useMemo(
    () => getQuickExitAvailability(activeLevel),
    [activeLevel],
  );
  const filteredSpotIds = useMemo(
    () => {
      const ids = getFilteredSpotIds(levelSpots, activeLevel, filters);
      if (routeTarget?.level === activeLevel) {
        ids.add(routeTarget.spot.id);
      }

      return ids;
    },
    [activeLevel, filters, levelSpots, routeTarget],
  );
  const metrics = buildDashboardMetrics(spots);
  const levelSummaries = levels.map((level) => ({
    level,
    summary: getLevelSummary(spots, level),
  }));
  const isAdmin = session.user.role === 'ADMIN';

  useEffect(() => {
    let ignore = false;

    async function loadConnectedBackendFeatures() {
      setOperationsError('');

      try {
        const [summaryResponse, lotsResponse] = await Promise.all([
          operationsService.getSummary(),
          operationsService.getLots(),
        ]);
        const [profileResponse, myReservationsResponse, myDisabilityResponse] = isAdmin
          ? [null, { reservations: [] }, { verification: null }]
          : await Promise.all([
              authService.getProfile(session.token),
              operationsService.getMyReservations(session.token),
              operationsService.getMyDisabilityVerification(session.token),
            ]);

        const adminResponses = isAdmin
          ? await Promise.all([
              operationsService.getAdmins(),
              operationsService.getRegisteredSpots(),
              operationsService.getReservations(),
              operationsService.getDisabilityVerifications(),
            ])
          : [];

        if (ignore) {
          return;
        }

        setProfile(profileResponse);
        setOperations({
          summary: summaryResponse,
          lots: lotsResponse.lots || [],
          reservations: isAdmin
            ? adminResponses[2]?.reservations || []
            : myReservationsResponse.reservations || [],
          admins: adminResponses[0]?.admins || [],
          registeredSpots: adminResponses[1]?.spots || [],
          disabilityVerifications: adminResponses[3]?.verifications || [],
          myDisabilityVerification: myDisabilityResponse.verification,
        });
      } catch (err) {
        if (!ignore) {
          setOperationsError(err.message || 'Could not load connected backend features.');
        }
      }
    }

    loadConnectedBackendFeatures();

    return () => {
      ignore = true;
    };
  }, [isAdmin, session.token]);

  useEffect(() => {
    if (filters.quickExit && !quickExitAvailability[filters.quickExit]) {
      setFilters((current) => ({ ...current, quickExit: null }));
    }
  }, [filters.quickExit, quickExitAvailability]);

  useEffect(() => {
    if (selectedSpot && selectedSpot.level !== activeLevel) {
      setSelectedSpot(null);
      return;
    }

    if (
      selectedSpot &&
      selectedSpot.level === activeLevel &&
      !filteredSpotIds.has(selectedSpot.id)
    ) {
      setSelectedSpot(null);
    }
  }, [activeLevel, filteredSpotIds, selectedSpot]);

  useEffect(() => {
    if (routeTarget && routeTarget.level !== activeLevel) {
      return;
    }

    if (routeTarget && !levelSpots.some((spot) => spot.id === routeTarget.spot.id && spot.status === 'available')) {
      setRouteTarget(null);
      setParkingGuidance('');
    }
  }, [activeLevel, levelSpots, routeTarget]);

  useEffect(() => {
    if (!routeTarget || routeTarget.level !== activeLevel) {
      return undefined;
    }

    routeScrollTimeoutRef.current = window.setTimeout(() => {
      document
        .getElementById(`parking-spot-${routeTarget.spot.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 120);

    return () => {
      window.clearTimeout(routeScrollTimeoutRef.current);
    };
  }, [activeLevel, routeTarget]);

  async function handleStatusUpdate(spotId, status) {
    const response = await parkingService.updateSpotStatus(spotId, status);
    await refreshSpots();
    setSelectedSpot(response.spot);
  }

  async function handleAssign(spotId, assignee) {
    const response = await parkingService.assignSpot(spotId, assignee);
    await refreshSpots();
    setSelectedSpot(response.spot);
  }

  async function handleBulkStatus(mode) {
    setBulkStatusLoading(true);
    try {
      await parkingService.updateBulkSpotStatus(mode);
      await refreshSpots();
      setRouteTarget(null);
      setSelectedSpot(null);
      setFloorSuggestion(null);
      setParkingGuidance(`Admin test mode applied: ${mode}.`);
    } catch (err) {
      setParkingGuidance(err.message || 'Admin test mode failed. Restart the backend and try again.');
    } finally {
      setBulkStatusLoading(false);
    }
  }

  async function handleDisabilitySubmit(event) {
    event.preventDefault();
    if (!documentUrl.trim() || isAdmin) {
      return;
    }

    const response = await operationsService.submitDisabilityVerification(
      session.token,
      documentUrl.trim(),
    );
    setOperations((current) => ({
      ...current,
      myDisabilityVerification: response.verification,
    }));
    setDocumentUrl('');
  }

  function handleFindClosestSpot() {
    const currentResult = findClosestAvailableSpot(levelSpots, activeLevel);

    if (currentResult.spot) {
      setFloorSuggestion(null);
      setRouteTarget({
        level: activeLevel,
        spot: currentResult.spot,
        lane: currentResult.lane,
      });
      setSelectedSpot(null);
      setParkingGuidance(
        `Closest available spot from the exit entrance on ${activeLevel} is highlighted on the map.`,
      );
      return;
    }

    const alternative = findNearestLevelWithAvailableSpot(spots, activeLevel, levels);
    setRouteTarget(null);
    setSelectedSpot(null);

    if (!alternative) {
      setFloorSuggestion(null);
      setParkingGuidance(`${activeLevel} is completely full, and no nearby floor has an available spot.`);
      return;
    }

    setFloorSuggestion(alternative);
    setParkingGuidance(
      `${activeLevel} is completely full. ${alternative.level} has an available spot near its exit entrance. Check that floor?`,
    );
  }

  function handleAcceptFloorSuggestion() {
    if (!floorSuggestion) {
      return;
    }

    setActiveLevel(floorSuggestion.level);
    setRouteTarget({
      level: floorSuggestion.level,
      spot: floorSuggestion.spot,
      lane: floorSuggestion.lane,
    });
    setSelectedSpot(null);
    setParkingGuidance(
      `Showing the closest available spot on ${floorSuggestion.level}. It is highlighted on the map.`,
    );
    setFloorSuggestion(null);
  }

  function handleDismissFloorSuggestion() {
    setFloorSuggestion(null);
    setParkingGuidance(`${activeLevel} is completely full. Staying on this floor.`);
  }

  const pageShellClasses = 'mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8';
  const contentGridClasses = 'grid gap-6 xl:grid-cols-[300px_1fr]';

  return (
    <main className={pageShellClasses}>
      <section
        className="campus-image relative w-full overflow-hidden rounded-[32px] border border-neutral-200 p-6 shadow-lift sm:p-8"
        style={{ backgroundImage: `url(${beirutGardenSage})` }}
      >
        <div className="absolute inset-0 bg-white/58" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/90 via-[#fffaf2]/76 to-white/52" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7efe2]/42 to-transparent" />
        <div className="relative grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="max-w-2xl">
            <h2 className="max-w-2xl font-display text-[2.6rem] font-semibold leading-[1.08] text-[#6f4b2d] sm:text-[3.2rem] xl:text-[3.8rem]">
              {isAdmin
                ? 'Campus parking operations with structured controls and live level monitoring.'
                : 'Effortless Parking for the LAU Community'}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#7e5a3c] sm:text-lg">
              {isAdmin
                ? 'Review occupancy, assign official spaces, and manage maintenance states from a polished operations workspace.'
                : 'Explore underground levels, inspect spot details, and quickly understand real-time availability through a student-friendly interface.'}
            </p>
          </div>

          <div className="grid gap-4 xl:justify-self-end xl:w-[14.5rem]">
            {metrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </section>

      <div>
        <section className={`mt-6 ${contentGridClasses}`}>
          <Sidebar
            role={session.user.role}
            activeLevel={activeLevel}
            levels={levels}
            onLevelChange={setActiveLevel}
            filters={filters}
            onFiltersChange={(updates) =>
              setFilters((current) => ({ ...current, ...updates }))
            }
            quickExitAvailability={quickExitAvailability}
          />

          <div className="space-y-6">
            <StatusLegend />

            <div className="rounded-[24px] border border-cyan-200 bg-cyan-50/70 p-4 shadow-soft">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    Closest spot guidance
                  </p>
                  <p className="mt-2 text-sm font-medium text-cyan-950">
                    {parkingGuidance || 'Use the exit entrance as the reference point to find the closest available spot.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {floorSuggestion && (
                    <>
                      <button
                        type="button"
                        onClick={handleAcceptFloorSuggestion}
                        className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
                      >
                        Check {floorSuggestion.level}
                      </button>
                      <button
                        type="button"
                        onClick={handleDismissFloorSuggestion}
                        className="rounded-xl border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
                      >
                        Stay here
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleFindClosestSpot}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
                  >
                    Find Closest Spot
                  </button>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Admin testing
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-700">
                      Quickly switch non-accessible spots for occupancy testing.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleBulkStatus('occupied')}
                        disabled={bulkStatusLoading}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                      All Occupied
                    </button>
                      <button
                        type="button"
                        onClick={() => handleBulkStatus('available')}
                        disabled={bulkStatusLoading}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                      All Available
                    </button>
                      <button
                        type="button"
                        onClick={() => handleBulkStatus('random')}
                        disabled={bulkStatusLoading}
                        className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
                      >
                      Randomize
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {levelSummaries.map(({ level, summary }) => (
                <LevelSummaryCard key={level} level={level} summary={summary} />
              ))}
            </div>

            <div>
              <ParkingGrid
                level={activeLevel}
                spots={levelSpots}
                filteredSpotIds={filteredSpotIds}
                onSpotClick={setSelectedSpot}
                routeTargetSpotId={routeTarget?.level === activeLevel ? routeTarget.spot.id : null}
              />
            </div>
          </div>
        </section>

        {!loading && (
          <SpotDetailsModal
            role={session.user.role}
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
            onStatusUpdate={handleStatusUpdate}
            onAssign={handleAssign}
          />
        )}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="surface-card rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Connected profile
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-neutral-900">
              {profile?.fullName || session.user.fullName}
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
              <p>Username: {profile?.username || session.user.username}</p>
              <p>Email: {profile?.email || 'Not loaded'}</p>
              <p>License: {profile?.licensePlate || 'Not loaded'}</p>
              <p>Disability: {profile?.hasDisability ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="surface-card rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Database features
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Lots', operations.summary?.lots ?? 0],
                ['DB spots', operations.summary?.registeredSpots ?? 0],
                ['Reservations', operations.summary?.reservations ?? 0],
                ['Pending verifications', operations.summary?.pendingDisabilityVerifications ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
            {operationsError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {operationsError}
              </p>
            )}
          </div>

          {!isAdmin && (
          <div className="surface-card rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Disability verification
            </p>
            <h3 className="mt-2 text-xl font-semibold text-neutral-900">
              {operations.myDisabilityVerification?.status || 'No submission yet'}
            </h3>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleDisabilitySubmit}>
              <input
                value={documentUrl}
                onChange={(event) => setDocumentUrl(event.target.value)}
                placeholder="Document URL"
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-brand-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                Submit
              </button>
            </form>
          </div>
          )}

          <div className="surface-card rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Parking lots
            </p>
            <div className="mt-4 space-y-3">
              {operations.lots.slice(0, 3).map((lot) => (
                <div key={lot.id} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <p className="font-semibold text-neutral-900">{lot.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {lot.location} - {lot.totalSpots} spots
                  </p>
                </div>
              ))}
              {operations.lots.length === 0 && (
                <p className="text-sm text-neutral-500">No database lots registered yet.</p>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="surface-card rounded-[28px] p-6 xl:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Admin-connected records
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <BackendRecordList
                  title="Admins"
                  items={operations.admins}
                  renderItem={(admin) => `${admin.username} - ${admin.adminLevel}`}
                />
                <BackendRecordList
                  title="Reservations"
                  items={operations.reservations}
                  renderItem={(reservation) =>
                    `${reservation.username || 'User'} - ${reservation.status}`
                  }
                />
                <BackendRecordList
                  title="Verification queue"
                  items={operations.disabilityVerifications}
                  renderItem={(verification) =>
                    `${verification.username || 'User'} - ${verification.status}`
                  }
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function BackendRecordList({ title, items, renderItem }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h4 className="font-semibold text-neutral-900">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.slice(0, 5).map((item) => (
          <p key={item.id} className="rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
            {renderItem(item)}
          </p>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No records yet.</p>
        )}
      </div>
    </div>
  );
}
