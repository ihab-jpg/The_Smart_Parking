package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * SMSAlert Entity - Tracks sent SMS alerts to users
 */
@Entity
@Table(name = "sms_alerts",
    indexes = {@Index(name = "idx_sms_alert_user_id", columnList = "user_id")}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SMSAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 50)
    private String alertType; // reservation_confirmed, payment_receipt, contact_request, etc.
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String messageBody;
    
    @Column(length = 100)
    private String twilioSid; // Twilio message ID
    
    @Column(length = 50)
    private String status = "sent"; // sent, failed, delivered
    
    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Relationships
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}