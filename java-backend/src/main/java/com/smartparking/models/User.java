package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * User Entity - Represents a parking system user
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_license_plate", columnList = "license_plate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 80)
    private String username;
    
    @Column(nullable = false, unique = true, length = 120)
    private String email;
    
    @Column(nullable = false, length = 255)
    @JsonIgnore
    private String passwordHash;
    
    @Column(nullable = false, length = 120)
    private String fullName;
    
    @Column(length = 20)
    private String phoneNumber;
    
    @Column(nullable = false, unique = true, length = 20)
    private String licensePlate;
    
    @Column(nullable = false)
    private Boolean isDisabled = false;
    
    @Column(columnDefinition = "JSON")
    private String preferences; // JSON: {near_entrance, proximity_preference, etc.}
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Payment> payments;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Rating> ratings;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL)
    private List<ContactRequest> contactRequests1;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL)
    private List<ContactRequest> contactRequests2;
    
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SMSAlert> smsAlerts;
}