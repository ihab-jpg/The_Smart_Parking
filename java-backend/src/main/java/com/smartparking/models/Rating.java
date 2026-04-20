package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Rating Entity - Represents a user's rating of a parking spot
 */
@Entity
@Table(name = "ratings",
    indexes = {@Index(name = "idx_rating_user_id", columnList = "user_id"),
               @Index(name = "idx_rating_spot_id", columnList = "spot_id"),
               @Index(name = "idx_rating_lot_id", columnList = "lot_id")}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    
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
    private Integer rating; // 1-5 stars
    
    @Column(columnDefinition = "TEXT")
    private String reviewText;
    
    @Column(length = 100)
    private String aspectRated; // comfort, cleanliness, safety, etc.
    
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
}