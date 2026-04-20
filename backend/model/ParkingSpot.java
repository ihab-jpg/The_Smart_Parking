package com.smartparking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Parking Spot Entity
 * ===================
 * Represents individual parking spots in the system
 */
@Entity
@Table(name = "parking_spots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSpot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private ParkingLot lot;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    private ParkingLevel level;
    
    @Column(nullable = false, length = 20)
    private String spotNumber; // e.g., "A1", "B2"
    
    @Column(nullable = false, length = 20)
    private String status; // available, occupied, reserved, disabled
    
    @Column(nullable = false)
    private Integer xCoordinate;
    
    @Column(nullable = false)
    private Integer yCoordinate;
    
    @Column(nullable = false, length = 50)
    private String spotType; // standard, compact, handicapped, ev_charging
    
    @Column(nullable = false)
    private Boolean isNearEntrance = false;
    
    @Column(nullable = false)
    private Boolean isDisabled = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_user_id")
    private User currentUser;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        return "ParkingSpot{" +
                "id=" + id +
                ", spotNumber='" + spotNumber + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
