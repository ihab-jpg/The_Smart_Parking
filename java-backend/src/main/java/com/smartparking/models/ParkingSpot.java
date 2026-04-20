package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * ParkingSpot Entity - Represents a single parking spot
 */
@Entity
@Table(name = "parking_spots",
    indexes = {@Index(name = "idx_spot_level_id", columnList = "level_id"),
               @Index(name = "idx_spot_lot_id", columnList = "lot_id"),
               @Index(name = "idx_spot_row_id", columnList = "row_id"),
               @Index(name = "idx_spot_current_user_id", columnList = "current_user_id")},
    uniqueConstraints = {@UniqueConstraint(name = "unique_spot_per_row", columnNames = {"row_id", "spot_number"})}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSpot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long levelId;
    
    @Column(nullable = false)
    private Long lotId;
    
    @Column(nullable = false)
    private Long rowId;
    
    @Column(nullable = false, length = 20)
    private String spotNumber; // A1, A2, B1, etc.
    
    @Column(length = 50)
    private String spotType = "regular"; // regular, disabled, vip, etc.
    
    @Column(length = 50)
    private String status = "available"; // available, occupied, reserved, maintenance
    
    @Column
    private Double xCoordinate; // For map rendering
    
    @Column
    private Double yCoordinate; // For map rendering
    
    @Column
    private Boolean isNearEntrance = false;
    
    @Column
    private Long currentUserId; // User currently parking here
    
    @Column
    private Double averageRating = 0.0;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "level_id", insertable = false, updatable = false)
    private ParkingLevel level;
    
    @ManyToOne
    @JoinColumn(name = "lot_id", insertable = false, updatable = false)
    private ParkingLot lot;
    
    @ManyToOne
    @JoinColumn(name = "row_id", insertable = false, updatable = false)
    private Row row;
    
    @ManyToOne
    @JoinColumn(name = "current_user_id", insertable = false, updatable = false)
    private User currentUser;
    
    @JsonIgnore
    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL)
    private List<Rating> ratings;
    
    @JsonIgnore
    @OneToMany(mappedBy = "spot", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
}