<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
=======
import { useState } from 'react';
>>>>>>> dd17e67 (Update frontend parking system UI)
import beirutGardenSage from '../assets/beirutGardenSage.avif';
import LevelSummaryCard from '../components/LevelSummaryCard';
import ParkingGrid from '../components/ParkingGrid';
import Sidebar from '../components/Sidebar';
import SpotDetailsModal from '../components/SpotDetailsModal';
import StatusLegend from '../components/StatusLegend';
import StatCard from '../components/ui/StatCard';
<<<<<<< HEAD
import { useParkingData } from '../hooks/useParkingData';
import { useAuth } from '../hooks/useAuth';
import * as parkingService from '../services/parkingService';
import {
  buildDashboardMetrics,
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
=======
import { useAuth } from '../hooks/useAuth';
import { useParkingData } from '../hooks/useParkingData';
import * as parkingService from '../services/parkingService';
import {
  buildDashboardMetrics,
  getLevelSummary,
} from '../utils/parking';
import { recentActivity } from '../data/mockParkingData';
>>>>>>> dd17e67 (Update frontend parking system UI)

export default function DashboardPage() {
  const { session } = useAuth();
  const { levels, spots, loading, refreshSpots } = useParkingData();
  const [activeLevel, setActiveLevel] = useState('L1');
  const [selectedSpot, setSelectedSpot] = useState(null);
<<<<<<< HEAD
  const [filters, setFilters] = useState(defaultFilters);

  const levelSpots = useMemo(
    () => spots.filter((spot) => spot.level === activeLevel),
    [activeLevel, spots],
  );
  const quickExitAvailability = useMemo(
    () => getQuickExitAvailability(activeLevel),
    [activeLevel],
  );
  const filteredSpotIds = useMemo(
    () => getFilteredSpotIds(levelSpots, activeLevel, filters),
    [activeLevel, filters, levelSpots],
  );
=======

  const filteredSpots = spots.filter((spot) => spot.level === activeLevel);
>>>>>>> dd17e67 (Update frontend parking system UI)
  const metrics = buildDashboardMetrics(spots);
  const levelSummaries = levels.map((level) => ({
    level,
    summary: getLevelSummary(spots, level),
  }));
<<<<<<< HEAD
  const isAdmin = session.user.role === 'ADMIN';

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

=======
  const activeLevelSummary = getLevelSummary(spots, activeLevel);
  const isAdmin = session.user.role === 'ADMIN';

>>>>>>> dd17e67 (Update frontend parking system UI)
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

<<<<<<< HEAD
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
=======
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section
        className="campus-image relative overflow-hidden rounded-[32px] border border-neutral-200 p-6 shadow-lift sm:p-8"
        style={{ backgroundImage: `url(${beirutGardenSage})` }}
      >
        <div className="absolute inset-0 bg-white/68" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2]/94 via-[#fffaf2]/80 to-white/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7efe2]/34 to-transparent" />
        <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9c6a3d] sm:text-sm">
              {isAdmin ? 'Admin dashboard' : 'User dashboard'}
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-[2.6rem] font-semibold leading-[1.08] text-[#6f4b2d] sm:text-[3.2rem] xl:text-[3.8rem]">
              {isAdmin
                ? 'Campus parking operations with structured controls and live level monitoring.'
                : 'A cleaner way for LAU members to find parking.'}
>>>>>>> dd17e67 (Update frontend parking system UI)
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#7e5a3c] sm:text-lg">
              {isAdmin
                ? 'Review occupancy, assign official spaces, and manage maintenance states from a polished operations workspace.'
                : 'Explore underground levels, inspect spot details, and quickly understand real-time availability through a student-friendly interface.'}
            </p>
          </div>

<<<<<<< HEAD
          <div className="grid gap-4 xl:justify-self-end xl:w-[14.5rem]">
=======
          <div className="grid gap-4 sm:grid-cols-2 xl:justify-self-end xl:max-w-2xl">
>>>>>>> dd17e67 (Update frontend parking system UI)
            {metrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
      </div>
=======
      <section className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
        <Sidebar
          role={session.user.role}
          activeLevel={activeLevel}
          levels={levels}
          onLevelChange={setActiveLevel}
        />

        <div className="space-y-6">
          <StatusLegend />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {levelSummaries.map(({ level, summary }) => (
              <LevelSummaryCard key={level} level={level} summary={summary} />
            ))}
          </div>

          <div className="surface-card rounded-[28px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
                  Level overview
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-neutral-900">
                  {activeLevel} live occupancy snapshot
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Total</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-900">
                    {activeLevelSummary.total}
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-brand-700">Available</p>
                  <p className="mt-1 text-xl font-semibold text-brand-700">
                    {activeLevelSummary.available}
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-rose-700">Occupied</p>
                  <p className="mt-1 text-xl font-semibold text-rose-700">
                    {activeLevelSummary.occupied}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <ParkingGrid
              level={activeLevel}
              spots={filteredSpots}
              onSpotClick={setSelectedSpot}
            />

            <aside className="space-y-6">
              <div className="surface-card rounded-[28px] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
                  {isAdmin ? 'Admin actions' : 'User guidance'}
                </p>
                <div className="mt-4 space-y-3">
                  {isAdmin ? (
                    <>
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        <p className="text-sm font-semibold text-neutral-900">Official assignments</p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          Reserve priority spots for university offices and administrators.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        <p className="text-sm font-semibold text-neutral-900">Maintenance controls</p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          Suspend spaces temporarily when lighting, sensors, or access lanes need updates.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        <p className="text-sm font-semibold text-neutral-900">Arrive with confidence</p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          Green spots indicate immediate availability. Red spots are currently occupied.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-neutral-50 p-4">
                        <p className="text-sm font-semibold text-neutral-900">Tap for details</p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          Open any space to inspect type, assignment, and backend-ready DTO information.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="surface-card rounded-[28px] p-5">
                <p className="text-sm font-semibold text-neutral-900">Recent activity</p>
                <div className="mt-4 space-y-3">
                  {recentActivity.map((entry) => (
                    <div key={entry.id} className="rounded-2xl bg-neutral-50 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                        {entry.time}
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-700">
                        {entry.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-neutral-900 p-5 text-white shadow-panel">
                <p className="text-sm uppercase tracking-[0.22em] text-brand-200">
                  Spring Boot routes
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-200">
                  <li>`POST /api/auth/login`</li>
                  <li>`GET /api/parking/levels`</li>
                  <li>`GET /api/parking/spots`</li>
                  <li>`PATCH /api/parking/spots/{'{id}'}/status`</li>
                  <li>`PATCH /api/parking/spots/{'{id}'}/assign`</li>
                </ul>
              </div>

              {isAdmin ? (
                <div className="surface-card rounded-[28px] p-5">
                  <p className="text-sm font-semibold text-neutral-900">Admin control summary</p>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50 text-neutral-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Task</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-neutral-200">
                          <td className="px-4 py-3 text-neutral-700">Spot assignment review</td>
                          <td className="px-4 py-3 text-brand-700">Ready</td>
                        </tr>
                        <tr className="border-t border-neutral-200">
                          <td className="px-4 py-3 text-neutral-700">Maintenance suspension</td>
                          <td className="px-4 py-3 text-amber-700">Monitor</td>
                        </tr>
                        <tr className="border-t border-neutral-200">
                          <td className="px-4 py-3 text-neutral-700">Occupancy updates</td>
                          <td className="px-4 py-3 text-brand-700">Live</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="surface-card rounded-[28px] p-5">
                  <p className="text-sm font-semibold text-neutral-900">Student arrival checklist</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                      1. Select your preferred underground level.
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                      2. Review available green spaces and avoid red occupied ones.
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                      3. Open any spot card to inspect details before arrival.
                    </div>
                  </div>
                </div>
              )}
            </aside>
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
>>>>>>> dd17e67 (Update frontend parking system UI)
    </main>
  );
}
