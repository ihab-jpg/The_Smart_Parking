package com.smartparking.controller;

import com.smartparking.model.Admin;
import com.smartparking.model.DisabilityVerification;
import com.smartparking.model.ParkingLevel;
import com.smartparking.model.ParkingLot;
import com.smartparking.model.ParkingSpot;
import com.smartparking.model.Reservation;
import com.smartparking.model.User;
import com.smartparking.repository.AdminRepository;
import com.smartparking.repository.DisabilityVerificationRepository;
import com.smartparking.repository.ParkingLevelRepository;
import com.smartparking.repository.ParkingLotRepository;
import com.smartparking.repository.ParkingSpotRepository;
import com.smartparking.repository.ReservationRepository;
import com.smartparking.repository.UserRepository;
import com.smartparking.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/operations")
@RequiredArgsConstructor
public class OperationsController {

    private final AdminRepository adminRepository;
    private final DisabilityVerificationRepository disabilityVerificationRepository;
    private final ParkingLotRepository parkingLotRepository;
    private final ParkingLevelRepository parkingLevelRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/summary")
    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        long activeReservations = reservationRepository.findAll().stream()
                .filter((reservation) -> "active".equalsIgnoreCase(reservation.getStatus()))
                .count();
        long pendingVerifications = disabilityVerificationRepository.findAll().stream()
                .filter((verification) -> "pending".equalsIgnoreCase(verification.getStatus()))
                .count();

        return Map.of(
                "users", userRepository.count(),
                "admins", adminRepository.count(),
                "lots", parkingLotRepository.count(),
                "levels", parkingLevelRepository.count(),
                "registeredSpots", parkingSpotRepository.count(),
                "reservations", reservationRepository.count(),
                "activeReservations", activeReservations,
                "pendingDisabilityVerifications", pendingVerifications
        );
    }

    @GetMapping("/admins")
    @Transactional(readOnly = true)
    public Map<String, Object> getAdmins() {
        List<AdminResponse> admins = adminRepository.findAll().stream()
                .map(AdminResponse::from)
                .toList();

        return Map.of("admins", admins);
    }

    @GetMapping("/lots")
    @Transactional(readOnly = true)
    public Map<String, Object> getLots() {
        List<LotResponse> lots = parkingLotRepository.findAll().stream()
                .map(LotResponse::from)
                .toList();

        return Map.of("lots", lots);
    }

    @GetMapping("/registered-spots")
    @Transactional(readOnly = true)
    public Map<String, Object> getRegisteredSpots() {
        List<RegisteredSpotResponse> spots = parkingSpotRepository.findAll().stream()
                .map(RegisteredSpotResponse::from)
                .toList();

        return Map.of("spots", spots);
    }

    @GetMapping("/reservations")
    @Transactional(readOnly = true)
    public Map<String, Object> getReservations() {
        List<ReservationResponse> reservations = reservationRepository.findAll().stream()
                .map(ReservationResponse::from)
                .toList();

        return Map.of("reservations", reservations);
    }

    @GetMapping("/me/reservations")
    @Transactional(readOnly = true)
    public Map<String, Object> getMyReservations(@RequestHeader("Authorization") String token) {
        Long userId = extractUserId(token);
        List<ReservationResponse> reservations = reservationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ReservationResponse::from)
                .toList();

        return Map.of("reservations", reservations);
    }

    @GetMapping("/disability-verifications")
    @Transactional(readOnly = true)
    public Map<String, Object> getDisabilityVerifications() {
        List<DisabilityVerificationResponse> verifications = disabilityVerificationRepository.findAll().stream()
                .map(DisabilityVerificationResponse::from)
                .toList();

        return Map.of("verifications", verifications);
    }

    @GetMapping("/me/disability-verification")
    @Transactional(readOnly = true)
    public Map<String, Object> getMyDisabilityVerification(@RequestHeader("Authorization") String token) {
        Long userId = extractUserId(token);
        DisabilityVerificationResponse verification = disabilityVerificationRepository.findByUserId(userId)
                .map(DisabilityVerificationResponse::from)
                .orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("verification", verification);
        return response;
    }

    @PostMapping("/me/disability-verification")
    @Transactional
    public Map<String, Object> submitDisabilityVerification(
            @RequestHeader("Authorization") String token,
            @RequestBody DisabilityVerificationRequest request
    ) {
        Long userId = extractUserId(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DisabilityVerification verification = disabilityVerificationRepository.findByUserId(userId)
                .orElseGet(DisabilityVerification::new);
        verification.setUser(user);
        verification.setDocumentUrl(request.documentUrl());
        verification.setReviewNotes(null);
        verification.setReviewedAt(null);
        verification.setStatus("pending");

        DisabilityVerification saved = disabilityVerificationRepository.save(verification);
        return Map.of("verification", DisabilityVerificationResponse.from(saved));
    }

    private Long extractUserId(String token) {
        String cleanToken = token.replace("Bearer ", "");
        return jwtUtils.extractUserId(cleanToken);
    }

    private record AdminResponse(Long id, String username, String email, String adminLevel) {
        private static AdminResponse from(Admin admin) {
            return new AdminResponse(admin.getId(), admin.getUsername(), admin.getEmail(), admin.getAdminLevel());
        }
    }

    private record LotResponse(Long id, String name, String location, String address, Integer totalSpots, Double hourlyRate) {
        private static LotResponse from(ParkingLot lot) {
            return new LotResponse(
                    lot.getId(),
                    lot.getName(),
                    lot.getLocation(),
                    lot.getAddress(),
                    lot.getTotalSpots(),
                    lot.getHourlyRate()
            );
        }
    }

    private record RegisteredSpotResponse(
            Long id,
            String spotNumber,
            String status,
            String spotType,
            Boolean nearEntrance,
            Boolean disabled,
            String lotName,
            String levelName
    ) {
        private static RegisteredSpotResponse from(ParkingSpot spot) {
            ParkingLot lot = spot.getLot();
            ParkingLevel level = spot.getLevel();

            return new RegisteredSpotResponse(
                    spot.getId(),
                    spot.getSpotNumber(),
                    spot.getStatus(),
                    spot.getSpotType(),
                    spot.getIsNearEntrance(),
                    spot.getIsDisabled(),
                    lot == null ? null : lot.getName(),
                    level == null ? null : level.getLevelName()
            );
        }
    }

    private record ReservationResponse(
            Long id,
            String username,
            String spotNumber,
            String lotName,
            LocalDateTime parkingStartTime,
            LocalDateTime parkingEndTime,
            String status,
            Double estimatedCost
    ) {
        private static ReservationResponse from(Reservation reservation) {
            User user = reservation.getUser();
            ParkingSpot spot = reservation.getSpot();
            ParkingLot lot = reservation.getLot();

            return new ReservationResponse(
                    reservation.getId(),
                    user == null ? null : user.getUsername(),
                    spot == null ? null : spot.getSpotNumber(),
                    lot == null ? null : lot.getName(),
                    reservation.getParkingStartTime(),
                    reservation.getParkingEndTime(),
                    reservation.getStatus(),
                    reservation.getEstimatedCost()
            );
        }
    }

    private record DisabilityVerificationResponse(
            Long id,
            Long userId,
            String username,
            String documentUrl,
            String status,
            String reviewNotes,
            LocalDateTime submittedAt,
            LocalDateTime reviewedAt
    ) {
        private static DisabilityVerificationResponse from(DisabilityVerification verification) {
            User user = verification.getUser();

            return new DisabilityVerificationResponse(
                    verification.getId(),
                    user == null ? null : user.getId(),
                    user == null ? null : user.getUsername(),
                    verification.getDocumentUrl(),
                    verification.getStatus(),
                    verification.getReviewNotes(),
                    verification.getSubmittedAt(),
                    verification.getReviewedAt()
            );
        }
    }

    private record DisabilityVerificationRequest(String documentUrl) {
    }
}
