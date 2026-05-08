package com.smartparking.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/parking")
public class ParkingController {

    private static final List<String> LEVELS = List.of("L1", "L2", "L3", "L4", "L5");
    private static final List<String> SPOT_TYPES = List.of("Student", "Faculty", "Official", "EV", "Accessible");
    private static final List<String> RESERVED_ASSIGNMENTS = List.of(
            "Dean Office",
            "Vice President",
            "Admissions",
            "Research Lab",
            "President Office",
            "Facilities",
            "Security Office"
    );
    private static final List<Integer> ACCESSIBLE_SPOT_NUMBERS = List.of(
            4, 5, 23, 24, 26, 27, 52, 53, 173, 174, 176, 177
    );

    private final Map<Long, ParkingSpotResponse> spots = new LinkedHashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void initializeSpots() {
        if (!spots.isEmpty()) {
            return;
        }

        Map<String, LevelConfiguration> configurations = Map.of(
                "L1", new LevelConfiguration("A", 98, 68, 22, 12),
                "L2", new LevelConfiguration("B", 76, 91, 21, 12),
                "L3", new LevelConfiguration("C", 110, 58, 20, 12),
                "L4", new LevelConfiguration("D", 84, 84, 20, 12),
                "L5", new LevelConfiguration("E", 92, 76, 20, 12)
        );

        for (String level : LEVELS) {
            buildLevelSpots(level, configurations.get(level)).forEach((spot) -> spots.put(spot.id(), spot));
        }
    }

    @GetMapping("/levels")
    public Map<String, Object> getLevels() {
        return Map.of("levels", LEVELS);
    }

    @GetMapping("/spots")
    public Map<String, Object> getSpots() {
        return Map.of("spots", new ArrayList<>(spots.values()));
    }

    @PutMapping("/spots/{spotId}/status")
    public Map<String, Object> updateSpotStatus(
            @PathVariable Long spotId,
            @RequestBody UpdateStatusRequest request
    ) {
        ParkingSpotResponse spot = getSpotOrThrow(spotId);
        ParkingSpotResponse updatedSpot = new ParkingSpotResponse(
                spot.id(),
                spot.label(),
                spot.level(),
                request.status(),
                "reserved".equals(request.status()) ? spot.assignedTo() : null,
                spot.type()
        );

        spots.put(spotId, updatedSpot);
        return Map.of("success", true, "spot", updatedSpot);
    }

    @PutMapping("/spots/{spotId}/assign")
    public Map<String, Object> assignSpot(
            @PathVariable Long spotId,
            @RequestBody AssignSpotRequest request
    ) {
        ParkingSpotResponse spot = getSpotOrThrow(spotId);
        String assignedTo = request.assignedTo() == null || request.assignedTo().isBlank()
                ? null
                : request.assignedTo().trim();
        ParkingSpotResponse updatedSpot = new ParkingSpotResponse(
                spot.id(),
                spot.label(),
                spot.level(),
                assignedTo == null ? "available" : "reserved",
                assignedTo,
                spot.type()
        );

        spots.put(spotId, updatedSpot);
        return Map.of("success", true, "spot", updatedSpot);
    }

    @PutMapping("/spots/bulk-status")
    public Map<String, Object> updateBulkSpotStatus(@RequestBody BulkStatusRequest request) {
        List<ParkingSpotResponse> updatedSpots = spots.values().stream()
                .map((spot) -> {
                    if ("suspended".equals(spot.status())) {
                        return spot;
                    }

                    String status = resolveBulkStatus(request.mode());
                    return new ParkingSpotResponse(
                            spot.id(),
                            spot.label(),
                            spot.level(),
                            status,
                            "reserved".equals(status) ? spot.assignedTo() : null,
                            spot.type()
                    );
                })
                .toList();

        spots.clear();
        updatedSpots.forEach((spot) -> spots.put(spot.id(), spot));

        return Map.of("success", true, "spots", updatedSpots);
    }

    private String resolveBulkStatus(String mode) {
        if ("random".equals(mode)) {
            return random.nextBoolean() ? "available" : "occupied";
        }

        if ("occupied".equals(mode)) {
            return "occupied";
        }

        return "available";
    }

    private ParkingSpotResponse getSpotOrThrow(Long spotId) {
        ParkingSpotResponse spot = spots.get(spotId);
        if (spot == null) {
            throw new IllegalArgumentException("Parking spot not found");
        }
        return spot;
    }

    private List<ParkingSpotResponse> buildLevelSpots(String level, LevelConfiguration configuration) {
        List<ParkingSpotResponse> levelSpots = new ArrayList<>();

        addSpots(levelSpots, level, configuration.prefix(), 1, configuration.available(), "available");
        addSpots(levelSpots, level, configuration.prefix(), levelSpots.size() + 1, configuration.occupied(), "occupied");
        addSpots(levelSpots, level, configuration.prefix(), levelSpots.size() + 1, configuration.reserved(), "reserved");
        addSpots(levelSpots, level, configuration.prefix(), levelSpots.size() + 1, configuration.extraAvailable(), "available");

        return levelSpots.stream()
                .map(this::markAccessibleSpot)
                .toList();
    }

    private void addSpots(
            List<ParkingSpotResponse> levelSpots,
            String level,
            String prefix,
            int startIndex,
            int count,
            String status
    ) {
        for (int i = 0; i < count; i++) {
            int spotNumber = startIndex + i;
            long id = Long.parseLong(level.substring(1)) * 1000 + spotNumber;
            String label = "%s-%02d".formatted(prefix, spotNumber);
            String assignedTo = "reserved".equals(status)
                    ? RESERVED_ASSIGNMENTS.get((spotNumber - 1) % RESERVED_ASSIGNMENTS.size())
                    : null;

            levelSpots.add(new ParkingSpotResponse(
                    id,
                    label,
                    level,
                    status,
                    assignedTo,
                    SPOT_TYPES.get((spotNumber - 1) % SPOT_TYPES.size())
            ));
        }
    }

    private ParkingSpotResponse markAccessibleSpot(ParkingSpotResponse spot) {
        int spotNumber = Integer.parseInt(spot.label().split("-")[1]);
        if (!ACCESSIBLE_SPOT_NUMBERS.contains(spotNumber)) {
            return spot;
        }

        return new ParkingSpotResponse(
                spot.id(),
                spot.label(),
                spot.level(),
                "suspended",
                "Accessible Parking Only",
                "Accessible"
        );
    }

    private record LevelConfiguration(String prefix, int available, int occupied, int reserved, int extraAvailable) {
    }

    private record ParkingSpotResponse(
            Long id,
            String label,
            String level,
            String status,
            String assignedTo,
            String type
    ) {
    }

    private record UpdateStatusRequest(String status) {
    }

    private record AssignSpotRequest(String assignedTo) {
    }

    private record BulkStatusRequest(String mode) {
    }
}
