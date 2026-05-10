package com.smartparking.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Password Hashing Utilities
 * ==========================
 */
public class PasswordUtils {
    
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * Hash a password using BCrypt
     * Input: password string
     * Output: hashed_password
     */
    public static String hashPassword(String password) {
        return encoder.encode(password);
    }

    /**
     * Verify a password against its hash
     * Input: password, hashed_password
     * Output: is_match (boolean)
     */
    public static boolean verifyPassword(String password, String hashedPassword) {
        return encoder.matches(password, hashedPassword);
    }
}
