package com.smartparking.dto;

import com.smartparking.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

/**
 * User Profile Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String licensePlate;
    private String phoneNumber;
    private Map<String, Object> preferences;
    private Boolean isDisabled;

    public UserProfileResponse(User user) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.licensePlate = user.getLicensePlate();
        this.phoneNumber = user.getPhoneNumber();
        this.preferences = user.getPreferences();
        this.isDisabled = user.getIsDisabled();
    }
}
