package com.smartparking.repository;

import com.smartparking.model.ParkingLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingLevelRepository extends JpaRepository<ParkingLevel, Long> {
}
