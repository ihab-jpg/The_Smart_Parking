package com.smartparking.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Token Utility Functions
 * ===========================
 */
@Component
public class JwtUtils {
    
    @Value("${app.auth.secret-key:dev-secret-key-change-in-production}")
    private String secretKey;
    
    @Value("${app.auth.jwt-expiration-ms:86400000}")
    private long jwtExpirationMs;

    /**
     * Generate JWT token for authenticated users
     * Input: userId, adminLevel (if admin)
     * Output: jwt_token, expiration_time
     */
    public String generateToken(Long userId, String adminLevel) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        if (adminLevel != null) {
            claims.put("adminLevel", adminLevel);
        }
        return createToken(claims, userId.toString());
    }

    /**
     * Verify JWT token from request headers
     * Input: token
     * Output: decoded_data (userId, adminLevel), is_valid
     */
    public Claims verifyToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extract userId from token
     */
    public Long extractUserId(String token) {
        return Long.valueOf(verifyToken(token).getSubject());
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        return verifyToken(token).getExpiration().before(new Date());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
}
