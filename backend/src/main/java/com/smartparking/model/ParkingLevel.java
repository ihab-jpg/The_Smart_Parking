package com.smartparking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Parking Level Entity
 * ====================
 * Represents different levels within a parking lot (e.g., Level 1, 2, 3)
 */
@Entity
@Table(name = "parking_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLevel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id", nullable = false)
    private ParkingLot lot;
    
    @Column(nullable = false, length = 50)
    private String levelName; // e.g., "Level 1", "Basement 2"
    
    @Column(nullable = false)
    private Integer levelNumber;
    
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
        return "ParkingLevel{" +
                "id=" + id +
                ", levelName='" + levelName + '\'' +
                '}';
    }
}
