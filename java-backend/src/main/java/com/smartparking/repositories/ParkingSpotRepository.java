package com.smartparking.repositories;

import com.smartparking.models.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    List<ParkingSpot> findByLotId(Long lotId);
    List<ParkingSpot> findByRowId(Long rowId);
    Optional<ParkingSpot> findByRowIdAndSpotNumber(Long rowId, String spotNumber);
    List<ParkingSpot> findByStatus(String status);
}