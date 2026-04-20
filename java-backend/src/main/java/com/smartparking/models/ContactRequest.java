package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * ContactRequest Entity - For accident contact sharing between users
 */
@Entity
@Table(name = "contact_requests",
    indexes = {@Index(name = "idx_contact_request_reservation_id", columnList = "reservation_id"),
               @Index(name = "idx_contact_request_user_id_1", columnList = "user_id_1"),
               @Index(name = "idx_contact_request_user_id_2", columnList = "user_id_2"),
               @Index(name = "idx_contact_request_admin_id", columnList = "admin_id")}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long reservationId;
    
    @Column(nullable = false)
    private Long userId1; // First user involved
    
    @Column(nullable = false)
    private Long userId2; // Second user involved
    
    @Column
    private Long adminId; // Admin facilitating contact
    
    @Column(nullable = false, length = 20)
    private String licensePlate1;
    
    @Column(nullable = false, length = 20)
    private String licensePlate2;
    
    @Column(columnDefinition = "TEXT")
    private String incidentDescription;
    
    @Column(length = 50)
    private String status = "open"; // open, in_progress, resolved, closed
    
    @Column
    private LocalDateTime contactSharedAt;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "reservation_id", insertable = false, updatable = false)
    private Reservation reservation;
    
    @ManyToOne
    @JoinColumn(name = "user_id_1", insertable = false, updatable = false)
    private User user1;
    
    @ManyToOne
    @JoinColumn(name = "user_id_2", insertable = false, updatable = false)
    private User user2;
    
    @ManyToOne
    @JoinColumn(name = "admin_id", insertable = false, updatable = false)
    private Admin admin;
}