package com.smartparking.util;

import java.util.regex.Pattern;

/**
 * Utility Functions Module
 * ======================
 * 
 * Contains helper functions for validation and utility operations
 */
public class ValidationUtils {
    
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String LICENSE_PLATE_PATTERN = "^[A-Z0-9]{2,8}$";
    private static final String PHONE_PATTERN = "^[+]?[0-9]{10,15}$";

    /**
     * Validate email format
     * Input: email string
     * Output: is_valid (boolean)
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return Pattern.compile(EMAIL_PATTERN).matcher(email).matches();
    }

    /**
     * Validate password strength
     * Checks password length, special chars, etc.
     * Input: password string
     * Output: is_valid (boolean), error_message
     */
    public static ValidationResult validatePassword(String password) {
        if (password == null || password.length() < 8) {
            return new ValidationResult(false, "Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            return new ValidationResult(false, "Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            return new ValidationResult(false, "Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*\\d.*")) {
            return new ValidationResult(false, "Password must contain at least one digit");
        }
        if (!password.matches(".*[!@#$%^&*()].*")) {
            return new ValidationResult(false, "Password must contain at least one special character");
        }
        return new ValidationResult(true, "Password is valid");
    }

    /**
     * Validate license plate format
     * Input: license_plate string
     * Output: is_valid (boolean)
     */
    public static boolean isValidLicensePlate(String licensePlate) {
        if (licensePlate == null || licensePlate.isEmpty()) {
            return false;
        }
        return Pattern.compile(LICENSE_PLATE_PATTERN).matcher(licensePlate).matches();
    }

    /**
     * Validate phone number format
     * Input: phone_number string
     * Output: is_valid (boolean), formatted_number
     */
    public static boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }
        return Pattern.compile(PHONE_PATTERN).matcher(phoneNumber).matches();
    }

    /**
     * Calculate distance between two points
     * Input: (x1, y1), (x2, y2)
     * Output: distance
     */
    public static double calculateDistance(double x1, double y1, double x2, double y2) {
        double dx = x2 - x1;
        double dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Validation Result Helper Class
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String message;

        public ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}
