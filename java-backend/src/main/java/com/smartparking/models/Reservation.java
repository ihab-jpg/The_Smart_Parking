package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Reservation Entity - Represents a parking reservation
 */
@Entity
@Table(name = "reservations",
    indexes = {@Index(name = "idx_reservation_user_id", columnList = "user_id"),
               @Index(name = "idx_reservation_spot_id", columnList = "spot_id"),
               @Index(name = "idx_reservation_lot_id", columnList = "lot_id")}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long spotId;
    
    @Column(nullable = false)
    private Long lotId;
    
    @Column(nullable = false)
    private LocalDateTime reservationStartTime;
    
    @Column
    private LocalDateTime reservationEndTime; // When user actually leaves
    
    @Column(length = 50)
    private String status = "active"; // active, completed, cancelled
    
    @Column
    private Integer durationMinutes;
    
    @Column
    private Double costCalculated;
    
    @Column
    private Boolean isPaid = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "spot_id", insertable = false, updatable = false)
    private ParkingSpot spot;
    
    @ManyToOne
    @JoinColumn(name = "lot_id", insertable = false, updatable = false)
    private ParkingLot lot;
    
    @JsonIgnore
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    private Payment payment;
    
    @JsonIgnore
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private List<ContactRequest> contactRequests;
}