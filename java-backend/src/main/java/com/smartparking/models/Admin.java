package com.smartparking.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Admin Entity - Represents an admin user
 */
@Entity
@Table(name = "admins", indexes = {
    @Index(name = "idx_admin_username", columnList = "username"),
    @Index(name = "idx_admin_email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    
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
    
    @Column(nullable = false, length = 50)
    private String adminLevel; // super_admin, admin, moderator
    
    @Column(columnDefinition = "JSON")
    private String permissions;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List<ContactRequest> contactRequests;
}