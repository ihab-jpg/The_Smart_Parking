import ParkingMap2D from './ParkingMap2D';

<<<<<<< HEAD
export default function ParkingGrid({ level, spots, filteredSpotIds, onSpotClick }) {
  return (
    <ParkingMap2D
      level={level}
      spots={spots}
      filteredSpotIds={filteredSpotIds}
      onSpotClick={onSpotClick}
    />
=======
export default function ParkingGrid({ level, spots, onSpotClick }) {
  return (
    <div className="parking-grid rounded-[28px] border border-neutral-200 bg-white p-6 shadow-panel">
      <ParkingMap2D level={level} spots={spots} onSpotClick={onSpotClick} />
    </div>
>>>>>>> dd17e67 (Update frontend parking system UI)
  );
}
