package com.smartparking.repositories;

import com.smartparking.models.ParkingLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingLevelRepository extends JpaRepository<ParkingLevel, Long> {
    List<ParkingLevel> findByLotId(Long lotId);
    Optional<ParkingLevel> findByLotIdAndLevelNumber(Long lotId, String levelNumber);
}