package com.smartparking.repositories;

import com.smartparking.models.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
    Optional<ParkingLot> findByName(String name);
}