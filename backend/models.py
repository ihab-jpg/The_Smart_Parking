"""
Database Models for Smart Parking System
========================================

Defines all SQLAlchemy ORM models for: Users, Admins, Parking Lots, Spots,
Payments, Reservations, Ratings, and Contact Requests.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# TODO: Create User Model
# - id (Primary Key)
# - username, email, password_hash
# - full_name, phone_number
# - license_plate (unique)
# - is_disabled (boolean)
# - preferences (JSON: near_entrance, proximity_preference, etc.)
# - created_at, updated_at
# - relationships: reservations, ratings, payments, contact_requests

# TODO: Create Admin Model
# - id (Primary Key)
# - username, email, password_hash
# - admin_level (super_admin, admin, moderator)
# - permissions (JSON)
# - created_at, updated_at
# - relationships: managed_lots, contact_facilitations

# TODO: Create ParkingLot Model
# - id (Primary Key)
# - name, location, address
# - total_spots
# - hourly_rate
# - created_at, updated_at
# - relationships: levels, spots, payments

# TODO: Create ParkingLevel Model
# - id (Primary Key)
# - lot_id (Foreign Key)
# - level_number (e.g., 1, 2, 3, B1, B2)
# - floor_name (Ground Floor, First Floor, etc.)
# - total_spots_on_level
# - created_at, updated_at
# - relationships: spots

# TODO: Create ParkingSpot Model
# - id (Primary Key)
# - level_id (Foreign Key)
# - lot_id (Foreign Key)
# - spot_number (e.g., A1, A2, B1)
# - spot_type (regular, disabled, vip, etc.)
# - status (available, occupied, reserved, maintenance)
# - x_coordinate, y_coordinate (for map rendering)
# - is_near_entrance (boolean)
# - current_user_id (Foreign Key, nullable) - who's currently parking here
# - average_rating (float)
# - created_at, updated_at
# - relationships: ratings, reservations

# TODO: Create Reservation Model
# - id (Primary Key)
# - user_id (Foreign Key)
# - spot_id (Foreign Key)
# - lot_id (Foreign Key)
# - reservation_start_time
# - reservation_end_time (calculated based on actual duration)
# - status (active, completed, cancelled)
# - duration_minutes
# - cost_calculated
# - is_paid (boolean)
# - created_at, updated_at
# - relationships: payment, accident_contact_requests

# TODO: Create Payment Model
# - id (Primary Key)
# - user_id (Foreign Key)
# - reservation_id (Foreign Key)
# - lot_id (Foreign Key)
# - amount
# - hourly_rate_applied
# - payment_method (credit_card, debit_card, etc.)
# - payment_gateway_id (Stripe/PayPal transaction ID)
# - status (pending, completed, failed, refunded)
# - payment_date
# - receipt_number
# - created_at, updated_at
# - relationships: user, reservation

# TODO: Create Rating Model
# - id (Primary Key)
# - user_id (Foreign Key)
# - spot_id (Foreign Key)
# - lot_id (Foreign Key)
# - rating (1-5 stars)
# - review_text
# - aspect_rated (comfort, cleanliness, safety, distance_to_entrance, etc.)
# - created_at, updated_at

# TODO: Create ContactRequest Model
# - id (Primary Key)
# - reservation_id (Foreign Key)
# - user_id_1 (Foreign Key) - first user involved in accident
# - user_id_2 (Foreign Key) - second user involved in accident
# - admin_id (Foreign Key) - admin facilitating contact
# - license_plate_1 (from user_1)
# - license_plate_2 (from user_2)
# - incident_description
# - status (open, in_progress, resolved, closed)
# - contact_shared_at (when contact info was shared)
# - created_at, updated_at
# - relationships: users, admin

# TODO: Create SMSAlert Model (optional, for tracking sent alerts)
# - id (Primary Key)
# - user_id (Foreign Key)
# - alert_type (reservation_confirmed, payment_receipt, contact_request, etc.)
# - message_body
# - twilio_sid (Twilio message ID)
# - status (sent, failed, delivered)
# - sent_at, created_at
