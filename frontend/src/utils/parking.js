import { levelCapacity, parkingLevels } from '../data/mockParkingData';

export const REMOVED_SPOT_NUMBERS = new Set([1, 2, 3, 46, 47, 48, 153, 154, 155, 198, 199, 200]);
export const ELEVATOR_SPOT_NUMBERS = new Set([25, 51, 175]);
export const EXIT_SPOT_NUMBERS_BY_LEVEL = {
  L1: new Set([193]),
  L5: new Set([193]),
};

export const STATUS_STYLES = {
  available: {
    badge: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    card: 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  occupied: {
    badge: 'border border-rose-200 bg-rose-50 text-rose-700',
    card: 'border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-300 hover:bg-rose-100',
    dot: 'bg-rose-500',
  },
  reserved: {
    badge: 'border border-amber-200 bg-amber-50 text-amber-700',
    card: 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300 hover:bg-amber-100',
    dot: 'bg-amber-500',
  },
  suspended: {
    badge: 'border border-slate-200 bg-slate-100 text-slate-700',
    card: 'border-slate-200 bg-slate-100 text-slate-800 hover:border-slate-300 hover:bg-slate-200',
    dot: 'bg-slate-500',
  },
};

export function getStatusLabel(status) {
  if (status === 'reserved') {
    return 'Under Maintenance';
  }

  if (status === 'suspended') {
    return 'Accessible Parking';
  }

  if (status === 'occupied') {
    return 'Occupied';
  }

  return 'Available';
}

export function groupSpotsByLevel(spots) {
  return spots.reduce((accumulator, spot) => {
    accumulator[spot.level] = accumulator[spot.level] || [];
    accumulator[spot.level].push(spot);
    return accumulator;
  }, {});
}

export function getSpotNumber(spot) {
  const parts = spot.label.split('-');
  return Number(parts[1]);
}

function getLevelPrefix(level) {
  return String.fromCharCode(64 + Number(level.slice(1)));
}

function formatSlotLabel(level, slotNumber) {
  return `${getLevelPrefix(level)}-${String(slotNumber).padStart(3, '0')}`;
}

function isExitSpot(spot) {
  return EXIT_SPOT_NUMBERS_BY_LEVEL[spot.level]?.has(getSpotNumber(spot)) || false;
}

function isVisibleOperationalSpot(spot) {
  const spotNumber = getSpotNumber(spot);
  return (
    !REMOVED_SPOT_NUMBERS.has(spotNumber) &&
    !ELEVATOR_SPOT_NUMBERS.has(spotNumber) &&
    !isExitSpot(spot)
  );
}

export function buildDashboardMetrics(spots) {
  const visibleSpots = spots.filter(isVisibleOperationalSpot);
  const counts = visibleSpots.reduce(
    (accumulator, spot) => {
      accumulator.total += 1;
      accumulator[spot.status] += 1;
      return accumulator;
    },
    {
      total: 0,
      available: 0,
      occupied: 0,
      reserved: 0,
      suspended: 0,
    },
  );

  return [
    { label: 'Available Now', value: counts.available, accent: 'bg-brand-600', detail: 'Open for immediate access' },
    { label: 'Occupied', value: counts.occupied, accent: 'bg-rose-600', detail: 'Currently in active use' },
    { label: 'Under Maintenance', value: counts.reserved, accent: 'bg-amber-500', detail: 'Temporarily unavailable for use' },
    { label: 'Accessible Parking', value: counts.suspended, accent: 'bg-slate-500', detail: 'Designated accessible spaces' },
  ];
}

export function getLevelSummary(spots, level) {
  const levelSpots = spots.filter((spot) => spot.level === level && isVisibleOperationalSpot(spot));
  const available = levelSpots.filter((spot) => spot.status === 'available').length;
  const occupied = levelSpots.filter((spot) => spot.status === 'occupied').length;
  const reserved = levelSpots.filter((spot) => spot.status === 'reserved').length;
  const suspended = levelSpots.filter((spot) => spot.status === 'suspended').length;
  const total = levelSpots.length || levelCapacity;
  const availableRate = Math.round((available / total) * 100);
  return {
    total,
    available,
    occupied,
    reserved,
    suspended,
    availableRate,
    fillRate: Math.round((occupied / total) * 100),
  };
}

export function buildMapLanes(spots, laneCount = 4, laneSize = 50) {
  const normalizedSpots = [...spots];

  while (normalizedSpots.length < laneCount * laneSize) {
    normalizedSpots.push(null);
  }

  return Array.from({ length: laneCount }, (_, index) => ({
    id: `lane-${index + 1}`,
    label: `Lane ${index + 1}`,
    spots: normalizedSpots.slice(index * laneSize, index * laneSize + laneSize),
  }));
}

export function buildLaneAvailability(spots, laneCount = 4, laneSize = 50) {
  const lanes = buildMapLanes(spots, laneCount, laneSize);

  return lanes.map((lane, index) => {
    const operationalSpots = lane.spots.filter((spot) => spot && isVisibleOperationalSpot(spot));
    const availableSpots = operationalSpots.filter((spot) => spot.status === 'available');

    return {
      id: lane.id,
      laneNumber: index + 1,
      spots: operationalSpots,
      availableSpots,
      isFull: operationalSpots.length > 0 && availableSpots.length === 0,
    };
  });
}

function getLayoutEntries(spots) {
  return buildMapLanes(spots).flatMap((lane, laneIndex) =>
    lane.spots
      .map((spot, slotIndex) => {
        if (!spot) {
          return null;
        }

        const section = slotIndex < 5 ? 'top' : slotIndex < 45 ? 'middle' : 'bottom';
        const middleRow = Math.max(0, Math.min(39, slotIndex - 5));

        return {
          spot,
          laneNumber: laneIndex + 1,
          slotIndex,
          section,
          middleRow,
          roadSide: laneIndex < 2 ? 'left' : 'right',
        };
      })
      .filter(Boolean),
  );
}

function getTravelScore(entry, exitEntry) {
  const bottomRoad = 40;
  const topRoad = -1;
  const crossRoadCost = entry.roadSide === exitEntry.roadSide ? 0 : 12;
  const exitRow = exitEntry.section === 'middle' ? exitEntry.middleRow : bottomRoad;

  if (entry.section === 'middle') {
    return (
      Math.abs(bottomRoad - exitRow) +
      crossRoadCost +
      Math.abs(bottomRoad - entry.middleRow)
    );
  }

  if (entry.section === 'bottom') {
    return Math.abs(bottomRoad - exitRow) + crossRoadCost + 1;
  }

  return Math.abs(topRoad - exitRow) + crossRoadCost + 1;
}

export function findClosestAvailableSpot(spots, level) {
  const lanes = buildLaneAvailability(spots);
  const entries = getLayoutEntries(spots);
  const exitEntry = entries.find((entry) => isExitSpot(entry.spot)) || {
    section: 'middle',
    middleRow: 37,
    roadSide: 'right',
  };
  const candidates = entries
    .filter((entry) => isVisibleOperationalSpot(entry.spot) && entry.spot.status === 'available')
    .map((entry) => ({
      spot: entry.spot,
      lane: lanes[entry.laneNumber - 1],
      distance: getTravelScore(entry, exitEntry),
    }))
    .sort((left, right) => left.distance - right.distance || getSpotNumber(left.spot) - getSpotNumber(right.spot));

  return {
    lanes,
    referenceSpotNumber: exitEntry.spot ? getSpotNumber(exitEntry.spot) : 193,
    spot: candidates[0]?.spot || null,
    lane: candidates[0]?.lane || null,
  };
}

export function findNearestLevelWithAvailableSpot(spots, currentLevel, levels = parkingLevels) {
  const currentLevelNumber = Number(currentLevel.slice(1));

  return levels
    .filter((level) => level !== currentLevel)
    .map((level) => {
      const levelSpots = spots.filter((spot) => spot.level === level);
      const result = findClosestAvailableSpot(levelSpots, level);

      return {
        level,
        levelDistance: Math.abs(Number(level.slice(1)) - currentLevelNumber),
        ...result,
      };
    })
    .filter((result) => result.spot)
    .sort((left, right) => left.levelDistance - right.levelDistance || left.level.localeCompare(right.level))[0] || null;
}

export function getDisplayedSpotLabel(levelSpots, level, targetSpotId) {
  let layoutPosition = 0;

  for (const spot of levelSpots) {
    const spotNumber = getSpotNumber(spot);

    if (REMOVED_SPOT_NUMBERS.has(spotNumber)) {
      continue;
    }

    layoutPosition += 1;

    if (spot.id === targetSpotId) {
      return formatSlotLabel(level, layoutPosition);
    }
  }

  return null;
}

const ENTRANCE_RANGES = {
  fountain: [
    [165, 185],
    [120, 130],
  ],
  civicCenter: [
    [1, 10],
    [51, 60],
  ],
  healthSciencesCenter: [
    [15, 35],
    [70, 80],
  ],
};

const QUICK_EXIT_RULES = {
  scienceBldg: {
    level: 'L5',
    ranges: [
      [135, 145],
      [185, 195],
    ],
  },
  upperGate: {
    level: 'L1',
    ranges: [
      [135, 145],
      [185, 195],
    ],
  },
};

function sortBySpotNumber(spots) {
  return [...spots].sort((left, right) => getSpotNumber(left) - getSpotNumber(right));
}

function filterAvailableOnly(spots) {
  return spots.filter((spot) => isVisibleOperationalSpot(spot) && spot.status === 'available');
}

function filterNearTarget(spots, target, radius = 12) {
  return spots.filter(
    (spot) => isVisibleOperationalSpot(spot) && Math.abs(getSpotNumber(spot) - target) <= radius,
  );
}

function filterByRanges(spots, ranges) {
  return spots.filter((spot) => {
    const spotNumber = getSpotNumber(spot);
    return isVisibleOperationalSpot(spot) && ranges.some(([start, end]) => spotNumber >= start && spotNumber <= end);
  });
}

function filterEasyParking(spots) {
  const sortedSpots = sortBySpotNumber(spots);
  const includedIds = new Set();
  let run = [];

  for (const spot of sortedSpots) {
    const currentNumber = getSpotNumber(spot);
    const previousNumber = run.length ? getSpotNumber(run[run.length - 1]) : null;
    const isConsecutive = previousNumber !== null && currentNumber === previousNumber + 1;

    if (spot.status === 'available' && (run.length === 0 || isConsecutive)) {
      run.push(spot);
      continue;
    }

    if (run.length >= 2) {
      run.forEach((runSpot) => includedIds.add(runSpot.id));
    }

    run = spot.status === 'available' ? [spot] : [];
  }

  if (run.length >= 2) {
    run.forEach((runSpot) => includedIds.add(runSpot.id));
  }

  return spots.filter((spot) => includedIds.has(spot.id));
}

export function getQuickExitAvailability(level) {
  return {
    scienceBldg: level === QUICK_EXIT_RULES.scienceBldg.level,
    upperGate: level === QUICK_EXIT_RULES.upperGate.level,
  };
}

function hasActiveSpotFilters(filters) {
  return Boolean(
    filters.availableOnly || filters.entrance || filters.easyParking || filters.quickExit,
  );
}

export function getFilteredSpotIds(spots, level, filters) {
  if (!hasActiveSpotFilters(filters)) {
    return new Set(spots.filter(isVisibleOperationalSpot).map((spot) => spot.id));
  }

  let result = spots.filter(isVisibleOperationalSpot);

  if (filters.availableOnly) {
    result = filterAvailableOnly(result);
  }

  if (filters.entrance) {
    result = filterByRanges(result, ENTRANCE_RANGES[filters.entrance] || []);
  }

  if (filters.easyParking) {
    result = filterEasyParking(result);
  }

  if (filters.quickExit) {
    const quickExit = QUICK_EXIT_RULES[filters.quickExit];

    if (!quickExit || quickExit.level !== level) {
      return new Set();
    }

    result = quickExit.ranges
      ? filterByRanges(result, quickExit.ranges)
      : filterNearTarget(result, quickExit.target);
  }

  return new Set(sortBySpotNumber(result).map((spot) => spot.id));
}
