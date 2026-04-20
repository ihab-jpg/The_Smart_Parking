package com.smartparking.repositories;

import com.smartparking.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findBySpotId(Long spotId);
    List<Reservation> findByStatus(String status);
}