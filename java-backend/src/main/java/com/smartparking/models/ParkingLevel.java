package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * ParkingLevel Entity - Represents a level/floor in a parking lot
 */
@Entity
@Table(name = "parking_levels", 
    indexes = {@Index(name = "idx_level_lot_id", columnList = "lot_id")},
    uniqueConstraints = {@UniqueConstraint(name = "unique_level_per_lot", columnNames = {"lot_id", "level_number"})}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLevel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long lotId;
    
    @Column(nullable = false, length = 20)
    private String levelNumber; // 1, 2, 3, B1, B2, etc.
    
    @Column(length = 120)
    private String floorName; // Ground Floor, First Floor, etc.
    
    @Column(nullable = false)
    private Integer totalSpotsOnLevel;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "lot_id", insertable = false, updatable = false)
    private ParkingLot lot;
    
    @JsonIgnore
    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    private List<Row> rows;
    
    @JsonIgnore
    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    private List<ParkingSpot> spots;
}