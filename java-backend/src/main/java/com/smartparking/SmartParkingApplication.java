package com.smartparking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Smart Parking System - Spring Boot Application Entry Point
 * 
 * Main class that starts the Spring Boot application with:
 * - JPA/Hibernate database integration
 * - CORS configuration
 * - Security setup
 */
@SpringBootApplication
public class SmartParkingApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartParkingApplication.class, args);
    }

    /**
     * Configure CORS for frontend access
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }
}