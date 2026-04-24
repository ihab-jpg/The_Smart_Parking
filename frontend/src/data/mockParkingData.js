export const parkingLevels = ['L1', 'L2', 'L3', 'L4', 'L5'];

export const levelCapacity = 200;

const levelConfigurations = {
  L1: { prefix: 'A', available: 98, occupied: 68, reserved: 22, suspended: 12 },
  L2: { prefix: 'B', available: 76, occupied: 91, reserved: 21, suspended: 12 },
  L3: { prefix: 'C', available: 110, occupied: 58, reserved: 20, suspended: 12 },
  L4: { prefix: 'D', available: 84, occupied: 84, reserved: 20, suspended: 12 },
  L5: { prefix: 'E', available: 92, occupied: 76, reserved: 20, suspended: 12 },
};

const reservedAssignments = [
  'Dean Office',
  'Vice President',
  'Admissions',
  'Research Lab',
  'President Office',
  'Facilities',
  'Security Office',
];

const suspendedAssignments = ['Maintenance', 'Sensors Upgrade', 'Lighting Fix', 'Painting'];
const spotTypes = ['Student', 'Faculty', 'Official', 'EV', 'Accessible'];
const accessibleSpotNumbers = new Set([
  4,
  5,
  23,
  24,
  26,
  27,
  52,
  53,
  173,
  174,
  176,
  177,
]);

function buildLevelSpots(level, configuration) {
  const statuses = [
    ...Array.from({ length: configuration.available }, () => 'available'),
    ...Array.from({ length: configuration.occupied }, () => 'occupied'),
    ...Array.from({ length: configuration.reserved }, () => 'reserved'),
    ...Array.from({ length: configuration.suspended }, () => 'suspended'),
  ];

  return statuses.map((status, index) => {
    const numericId = Number(level.slice(1)) * 100 + index + 1;
    const label = `${configuration.prefix}-${String(index + 1).padStart(2, '0')}`;
    const assignedTo =
      status === 'reserved'
        ? reservedAssignments[index % reservedAssignments.length]
        : status === 'suspended'
          ? suspendedAssignments[index % suspendedAssignments.length]
          : null;

    return {
      id: numericId,
      label,
      level,
      status,
      assignedTo,
      type: spotTypes[index % spotTypes.length],
    };
  });
}

export const parkingSpots = parkingLevels.flatMap((level) =>
  buildLevelSpots(level, levelConfigurations[level]).map((spot) => {
    const spotNumber = Number(spot.label.split('-')[1]);

    if (accessibleSpotNumbers.has(spotNumber)) {
      return {
        ...spot,
        status: 'suspended',
        assignedTo: 'Accessible Parking Only',
        type: 'Accessible',
      };
    }

    if (spot.status === 'suspended') {
      return {
        ...spot,
        status: 'available',
        assignedTo: null,
      };
    }

    return spot;
  }),
);

export const recentActivity = [
  { id: 1, time: '08:10', label: 'A-03 reserved for Dean Office', tone: 'reserved' },
  { id: 2, time: '09:05', label: 'B-22 marked occupied by gate sensor', tone: 'occupied' },
  { id: 3, time: '10:15', label: 'A-173 marked for accessible parking', tone: 'suspended' },
  { id: 4, time: '11:25', label: 'L4 availability updated to 40%', tone: 'available' },
];

export const mockUsers = {
  admin: {
    id: 1,
    fullName: 'Rana Khoury',
    role: 'ADMIN',
    email: 'admin@lau.edu.lb',
  },
  user: {
    id: 2,
    fullName: 'Karim Haddad',
    role: 'USER',
    email: 'student@lau.edu.lb',
  },
};
