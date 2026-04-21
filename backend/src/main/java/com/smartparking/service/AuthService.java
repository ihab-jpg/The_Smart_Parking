package com.smartparking.service;

import com.smartparking.dto.LoginRequest;
import com.smartparking.dto.RegisterRequest;
import com.smartparking.dto.UpdateProfileRequest;
import com.smartparking.model.User;
import com.smartparking.repository.UserRepository;
import com.smartparking.util.PasswordUtils;
import com.smartparking.util.ValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Authentication Service
 * ======================
 * 
 * Business logic for user authentication and profile management
 */
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;

    /**
     * Register a new user
     */
    public User registerUser(RegisterRequest request) {
        // Validate email
        if (!ValidationUtils.isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Validate license plate
        if (!ValidationUtils.isValidLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("Invalid license plate format");
        }

        // Validate password strength
        ValidationUtils.ValidationResult passwordValidation = ValidationUtils.validatePassword(request.getPassword());
        if (!passwordValidation.isValid()) {
            throw new IllegalArgumentException(passwordValidation.getMessage());
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        // Check if license plate already exists
        if (userRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new IllegalArgumentException("License plate already exists.");
        }
        // Check if phone number already exists
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists.");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(PasswordUtils.hashPassword(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setLicensePlate(request.getLicensePlate());
        user.setIsDisabled(false);
        user.setPreferences(request.getPreferences());

        return userRepository.save(user);
    }

    /**
     * Authenticate user with username/email and password
     */
    public User authenticateUser(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new IllegalArgumentException("User not found")));

        if (!PasswordUtils.verifyPassword(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return user;
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    /**
     * Update user profile
     */
    public User updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);

        if (request.getFullName() != null) {
            if(request.getFullName().isBlank()) {
                throw new IllegalArgumentException("Please enter a valid full name.");
            }
            user.setFullName(request.getFullName());
        }
        if (request.getPhoneNumber() != null) {
            if(!ValidationUtils.isValidPhoneNumber(request.getPhoneNumber())) {
                throw new IllegalArgumentException("Please enter a valid phone number.");
            }
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getPreferences() != null) {
            user.setPreferences(request.getPreferences());
        }

        return userRepository.save(user);
    }
}
