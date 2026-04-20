package com.smartparking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for Smart Parking System
 * ===========================================
 * 
 * Manages environment variables, database connections, API keys, and other configs.
 */
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {

    // Database Configuration (loaded from application.properties)
    private Database database = new Database();
    
    // Authentication Configuration
    private Authentication auth = new Authentication();
    
    // Twilio (SMS) Configuration
    private Twilio twilio = new Twilio();
    
    // Payment Gateway Configuration
    private Payment payment = new Payment();
    
    // AI Configuration
    private Integer aiDataRefreshInterval = 10; // Seconds between random spot updates

    // Getters and Setters
    public Database getDatabase() {
        return database;
    }

    public void setDatabase(Database database) {
        this.database = database;
    }

    public Authentication getAuth() {
        return auth;
    }

    public void setAuth(Authentication auth) {
        this.auth = auth;
    }

    public Twilio getTwilio() {
        return twilio;
    }

    public void setTwilio(Twilio twilio) {
        this.twilio = twilio;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Integer getAiDataRefreshInterval() {
        return aiDataRefreshInterval;
    }

    public void setAiDataRefreshInterval(Integer aiDataRefreshInterval) {
        this.aiDataRefreshInterval = aiDataRefreshInterval;
    }

    // ============================================================================
    // Nested Configuration Classes
    // ============================================================================

    public static class Database {
        private String url;
        private String username;
        private String password;
        private String driverClassName = "com.mysql.cj.jdbc.Driver";
        private Boolean showSql = false;
        private String hibernateDdlAuto = "update";

        // Getters and Setters
        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getDriverClassName() {
            return driverClassName;
        }

        public void setDriverClassName(String driverClassName) {
            this.driverClassName = driverClassName;
        }

        public Boolean getShowSql() {
            return showSql;
        }

        public void setShowSql(Boolean showSql) {
            this.showSql = showSql;
        }

        public String getHibernateDdlAuto() {
            return hibernateDdlAuto;
        }

        public void setHibernateDdlAuto(String hibernateDdlAuto) {
            this.hibernateDdlAuto = hibernateDdlAuto;
        }
    }

    public static class Authentication {
        private String secretKey = "dev-secret-key-change-in-production";
        private Long jwtExpirationMs = 86400000L; // 24 hours
        private String sessionTimeout = "24h";

        // Getters and Setters
        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public Long getJwtExpirationMs() {
            return jwtExpirationMs;
        }

        public void setJwtExpirationMs(Long jwtExpirationMs) {
            this.jwtExpirationMs = jwtExpirationMs;
        }

        public String getSessionTimeout() {
            return sessionTimeout;
        }

        public void setSessionTimeout(String sessionTimeout) {
            this.sessionTimeout = sessionTimeout;
        }
    }

    public static class Twilio {
        private String accountSid;
        private String authToken;
        private String phoneNumber;

        // Getters and Setters
        public String getAccountSid() {
            return accountSid;
        }

        public void setAccountSid(String accountSid) {
            this.accountSid = accountSid;
        }

        public String getAuthToken() {
            return authToken;
        }

        public void setAuthToken(String authToken) {
            this.authToken = authToken;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
    }

    public static class Payment {
        private String stripeSecretKey;
        private String stripePublishableKey;

        // Getters and Setters
        public String getStripeSecretKey() {
            return stripeSecretKey;
        }

        public void setStripeSecretKey(String stripeSecretKey) {
            this.stripeSecretKey = stripeSecretKey;
        }

        public String getStripePublishableKey() {
            return stripePublishableKey;
        }

        public void setStripePublishableKey(String stripePublishableKey) {
            this.stripePublishableKey = stripePublishableKey;
        }
    }
}
