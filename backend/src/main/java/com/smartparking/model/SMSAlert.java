package com.smartparking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * SMS Alert Entity
 * ================
 * Records SMS messages sent to users
 */
@Entity
@Table(name = "sms_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SMSAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 20)
    private String phoneNumber;
    
    @Column(nullable = false, length = 500)
    private String message;
    
    @Column(nullable = false, length = 50)
    private String alertType; // reservation_confirmation, payment_receipt, accident_contact, etc.
    
    @Column(nullable = false, length = 50)
    private String status; // sent, failed, pending
    
    @Column(length = 100)
    private String twilioMessageId;
    
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
        return "SMSAlert{" +
                "id=" + id +
                ", alertType='" + alertType + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
