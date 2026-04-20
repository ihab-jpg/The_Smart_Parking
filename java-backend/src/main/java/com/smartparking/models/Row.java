package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Row Entity - Represents a row of parking spots (scanned by camera)
 */
@Entity
@Table(name = "rows",
    indexes = {@Index(name = "idx_row_level_id", columnList = "level_id"),
               @Index(name = "idx_row_lot_id", columnList = "lot_id")},
    uniqueConstraints = {@UniqueConstraint(name = "unique_row_per_level", columnNames = {"level_id", "row_letter"})}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Row {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long levelId;
    
    @Column(nullable = false)
    private Long lotId;
    
    @Column(nullable = false, length = 10)
    private String rowLetter; // A, B, C, etc.
    
    @Column(nullable = false)
    private Integer totalSpotsInRow;
    
    @Column(length = 100)
    private String cameraId; // Camera identifier
    
    @Column
    private LocalDateTime lastScanTime; // Last AI scan timestamp
    
    @Column(columnDefinition = "JSON")
    private String lastScanData; // {spot_statuses from AI}
    
    @Column(length = 50)
    private String availabilityStatus = "scanning"; // all_available, partial, full, scanning, error
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "level_id", insertable = false, updatable = false)
    private ParkingLevel level;
    
    @JsonIgnore
    @OneToMany(mappedBy = "row", cascade = CascadeType.ALL)
    private List<ParkingSpot> spots;
}