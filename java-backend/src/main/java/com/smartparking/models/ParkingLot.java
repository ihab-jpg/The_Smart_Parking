package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * ParkingLot Entity - Represents a parking lot/facility
 */
@Entity
@Table(name = "parking_lots", indexes = {
    @Index(name = "idx_lot_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingLot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 120)
    private String name;
    
    @Column(nullable = false, length = 255)
    private String location;
    
    @Column(nullable = false, length = 255)
    private String address;
    
    @Column(nullable = false)
    private Integer totalSpots;
    
    @Column(nullable = false)
    private Double hourlyRate;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "lot", cascade = CascadeType.ALL)
    private List<ParkingLevel> levels;
    
    @JsonIgnore
    @OneToMany(mappedBy = "lot", cascade = CascadeType.ALL)
    private List<ParkingSpot> spots;
    
    @JsonIgnore
    @OneToMany(mappedBy = "lot", cascade = CascadeType.ALL)
    private List<Payment> payments;
    
    @JsonIgnore
    @OneToMany(mappedBy = "lot", cascade = CascadeType.ALL)
    private List<Rating> ratings;
    
    @JsonIgnore
    @OneToMany(mappedBy = "lot", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
}