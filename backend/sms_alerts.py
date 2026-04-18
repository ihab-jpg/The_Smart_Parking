"""
SMS Alerts Module
================

Integrates with Twilio to send SMS notifications for:
- Reservation confirmations
- Payment receipts
- Contact requests (accident facilitation)
- Alert reminders
"""

# TODO: Import Twilio client
# TODO: Import database models

# TODO: Implement send SMS function (core utility)
# Input: phone_number, message_body, alert_type
# Output: sms_sent (boolean), twilio_message_id
# Action: Send SMS via Twilio, Log to SMSAlert table

# TODO: Implement reservation confirmation SMS
# Triggered when user reserves a spot
# Message: "Your parking spot A1 at [Lot Name] is reserved until [time]. Cost: $X"

# TODO: Implement payment receipt SMS
# Triggered after successful payment
# Message: "Payment received. Receipt #XXX. Amount: $X. Thank you!"

# TODO: Implement accident contact request SMS
# Sent to both users involved
# Message: "Your parking incident has been reported. Admin contact: +XXX"

# TODO: Implement contact shared SMS
# Sent when admin shares contact info between users
# Message: "[User name] license plate: [XXX]. Contact: [phone/email]"

# TODO: Implement spot available alert SMS
# Sent to users watching/interested in a specific lot
# Message: "Your preferred spot type is now available at [Lot Name]"

# TODO: Implement parking expiring soon reminder SMS
# Scheduled to send 30 mins before reservation ends
# Message: "Your parking reservation expires in 30 minutes. Extend or prepay to avoid charges"

# TODO: Implement failed payment SMS
# Sent when payment processing fails
# Message: "Payment failed. Please update your payment method or contact support"

# TODO: Implement SMS alert batch sender
# Function to send bulk SMS to users (for announcements)
# Input: user_list, message_template
# Output: send_report (number sent, number failed)

# TODO: Implement SMS unsubscribe/opt-out system
# Users can disable certain alert types
# Store user preferences in User model

# TODO: Implement SMS delivery status webhook
# Receives callbacks from Twilio for SMS delivery status
# Updates SMSAlert table with delivery status

# TODO: Implement SMS alert retry mechanism
# If SMS fails, retry up to N times with exponential backoff
