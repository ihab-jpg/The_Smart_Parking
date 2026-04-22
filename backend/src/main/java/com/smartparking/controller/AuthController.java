package com.smartparking.controller;

import com.smartparking.dto.LoginRequest;
import com.smartparking.dto.LoginResponse;
import com.smartparking.dto.RegisterRequest;
import com.smartparking.dto.UserProfileResponse;
import com.smartparking.dto.UpdateProfileRequest;
import com.smartparking.model.User;
import com.smartparking.service.AuthService;
import com.smartparking.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * =========================
 * 
 * Handles user registration, login, logout, password hashing, JWT token generation.
 * Routes for: /auth/register, /auth/login, /auth/logout, /auth/profile
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    /**
     * User registration endpoint
     * POST /auth/register
     * Payload: {username, email, password, full_name, phone_number, license_plate, preferences}
     * Returns: {user_id, token, message}
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.registerUser(request);
            String token = jwtUtils.generateToken(user.getId(), null);
            return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                token,
                user.getUsername(),
                "User registered successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * User login endpoint
     * POST /auth/login
     * Payload: {username_or_email, password}
     * Returns: {token, user_id, username, is_admin}
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.authenticateUser(request);
            String token = jwtUtils.generateToken(user.getId(), null);
            return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                token,
                user.getUsername(),
                "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Invalid credentials"));
        }
    }

    /**
     * Get current user profile
     * GET /auth/profile (protected)
     * Returns: {user_id, username, email, full_name, license_plate, preferences, has_disability}
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            Long userId = jwtUtils.extractUserId(cleanToken);
            User user = authService.getUserById(userId);
            return ResponseEntity.ok(new UserProfileResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Unauthorized"));
        }
    }

    /**
     * Update user profile
     * PUT /auth/profile (protected)
     * Payload: {full_name, phone_number, preferences, has_disabilityd}
     * Returns: {updated_user}
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UpdateProfileRequest request) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            Long userId = jwtUtils.extractUserId(cleanToken);
            User updatedUser = authService.updateUserProfile(userId, request);
            return ResponseEntity.ok(new UserProfileResponse(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Error Response DTO
     */
    public static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }
}
