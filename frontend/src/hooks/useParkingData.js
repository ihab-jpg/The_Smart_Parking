import { useEffect, useState } from 'react';
import * as parkingService from '../services/parkingService';

export function useParkingData() {
  const [levels, setLevels] = useState([]);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [levelsResponse, spotsResponse] = await Promise.all([
        parkingService.getParkingLevels(),
        parkingService.getParkingSpots(),
      ]);

      setLevels(levelsResponse.levels);
      setSpots(spotsResponse.spots);
      setLoading(false);
    }

    loadData();
  }, []);

  async function refreshSpots() {
    const response = await parkingService.getParkingSpots();
    setSpots(response.spots);
  }

  return {
    levels,
    spots,
    loading,
    refreshSpots,
  };
}
