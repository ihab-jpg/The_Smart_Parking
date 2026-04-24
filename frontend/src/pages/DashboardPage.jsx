import { useEffect, useMemo, useState } from 'react';
import beirutGardenSage from '../assets/beirutGardenSage.avif';
import LevelSummaryCard from '../components/LevelSummaryCard';
import ParkingGrid from '../components/ParkingGrid';
import Sidebar from '../components/Sidebar';
import SpotDetailsModal from '../components/SpotDetailsModal';
import StatusLegend from '../components/StatusLegend';
import StatCard from '../components/ui/StatCard';
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

export default function DashboardPage() {
  const { session } = useAuth();
  const { levels, spots, loading, refreshSpots } = useParkingData();
  const [activeLevel, setActiveLevel] = useState('L1');
  const [selectedSpot, setSelectedSpot] = useState(null);
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
  const metrics = buildDashboardMetrics(spots);
  const levelSummaries = levels.map((level) => ({
    level,
    summary: getLevelSummary(spots, level),
  }));
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
    </main>
  );
}
