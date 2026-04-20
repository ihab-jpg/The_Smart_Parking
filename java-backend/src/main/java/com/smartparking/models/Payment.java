package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Payment Entity - Represents a payment transaction
 */
@Entity
@Table(name = "payments",
    indexes = {@Index(name = "idx_payment_user_id", columnList = "user_id"),
               @Index(name = "idx_payment_reservation_id", columnList = "reservation_id"),
               @Index(name = "idx_payment_lot_id", columnList = "lot_id")}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, unique = true)
    private Long reservationId;
    
    @Column(nullable = false)
    private Long lotId;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private Double hourlyRateApplied;
    
    @Column(nullable = false, length = 50)
    private String paymentMethod; // credit_card, debit_card, etc.
    
    @Column(length = 255)
    private String paymentGatewayId; // Stripe/PayPal transaction ID
    
    @Column(length = 50)
    private String status = "pending"; // pending, completed, failed, refunded
    
    @Column
    private LocalDateTime paymentDate;
    
    @Column(unique = true, length = 100)
    private String receiptNumber;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @OneToOne
    @JoinColumn(name = "reservation_id", insertable = false, updatable = false)
    private Reservation reservation;
    
    @ManyToOne
    @JoinColumn(name = "lot_id", insertable = false, updatable = false)
    private ParkingLot lot;
}