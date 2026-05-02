import ParkingMap2D from './ParkingMap2D';

export default function ParkingGrid({ level, spots, filteredSpotIds, onSpotClick }) {
  return (
    <ParkingMap2D
      level={level}
      spots={spots}
      filteredSpotIds={filteredSpotIds}
      onSpotClick={onSpotClick}
    />
  );
}
