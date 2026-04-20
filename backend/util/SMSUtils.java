package com.smartparking.util;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

/**
 * SMS Alerts Utilities Module
 * ===========================
 * 
 * Integrates with Twilio to send SMS notifications
 */
@Slf4j
@Component
public class SMSUtils {
    
    @Value("${app.twilio.account-sid:}")
    private String accountSid;
    
    @Value("${app.twilio.auth-token:}")
    private String authToken;
    
    @Value("${app.twilio.phone-number:}")
    private String twilioPhoneNumber;

    /**
     * Send SMS function (core utility)
     * Input: phone_number, message_body, alert_type
     * Output: sms_sent (boolean), twilio_message_id
     */
    public SMSSendResult sendSMS(String phoneNumber, String messageBody, String alertType) {
        if (accountSid == null || accountSid.isEmpty()) {
            log.warn("Twilio credentials not configured");
            return new SMSSendResult(false, null, "Twilio not configured");
        }

        try {
            Twilio.init(accountSid, authToken);
            Message message = Message.creator(
                    new PhoneNumber(twilioPhoneNumber),
                    new PhoneNumber(phoneNumber),
                    messageBody
            ).create();

            log.info("SMS sent successfully. Message ID: " + message.getSid() + ", Alert Type: " + alertType);
            return new SMSSendResult(true, message.getSid(), "SMS sent successfully");
        } catch (Exception e) {
            log.error("Failed to send SMS to " + phoneNumber, e);
            return new SMSSendResult(false, null, "Failed to send SMS: " + e.getMessage());
        }
    }

    /**
     * Send reservation confirmation SMS
     */
    public SMSSendResult sendReservationConfirmation(String phoneNumber, String spotNumber, String lotName, String time, Double cost) {
        String message = String.format("Your parking spot %s at %s is reserved until %s. Cost: $%.2f", 
            spotNumber, lotName, time, cost);
        return sendSMS(phoneNumber, message, "reservation_confirmation");
    }

    /**
     * Send payment receipt SMS
     */
    public SMSSendResult sendPaymentReceipt(String phoneNumber, String receiptNumber, Double amount) {
        String message = String.format("Payment received. Receipt #%s. Amount: $%.2f. Thank you!", 
            receiptNumber, amount);
        return sendSMS(phoneNumber, message, "payment_receipt");
    }

    /**
     * Send parking expiring soon reminder SMS
     */
    public SMSSendResult sendExpiringReminder(String phoneNumber, Integer minutesLeft) {
        String message = String.format("Your parking reservation expires in %d minutes. Extend or prepay to avoid charges", 
            minutesLeft);
        return sendSMS(phoneNumber, message, "parking_expiring_reminder");
    }

    /**
     * Result class for SMS operations
     */
    public static class SMSSendResult {
        private final boolean success;
        private final String messageId;
        private final String message;

        public SMSSendResult(boolean success, String messageId, String message) {
            this.success = success;
            this.messageId = messageId;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessageId() {
            return messageId;
        }

        public String getMessage() {
            return message;
        }
    }
}
