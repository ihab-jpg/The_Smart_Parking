"""
Database Models for Smart Parking System
========================================

Defines all SQLAlchemy ORM models for: Users, Admins, Parking Lots, Spots,
Payments, Reservations, Ratings, and Contact Requests.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()


# ============================================================================
# 1. USER MODEL
# ============================================================================
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    license_plate = db.Column(db.String(20), unique=True, nullable=False, index=True)
    is_disabled = db.Column(db.Boolean, default=False)
    preferences = db.Column(db.JSON, default=dict)  # {near_entrance, proximity_preference, etc.}
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reservations = db.relationship('Reservation', back_populates='user', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='user', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='user', cascade='all, delete-orphan')
    contact_requests_1 = db.relationship('ContactRequest', foreign_keys='ContactRequest.user_id_1', back_populates='user_1')
    contact_requests_2 = db.relationship('ContactRequest', foreign_keys='ContactRequest.user_id_2', back_populates='user_2')
    sms_alerts = db.relationship('SMSAlert', back_populates='user', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'


# ============================================================================
# 2. ADMIN MODEL
# ============================================================================
class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    admin_level = db.Column(db.String(50), nullable=False)  # super_admin, admin, moderator
    permissions = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    contact_requests = db.relationship('ContactRequest', back_populates='admin', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Admin {self.username}>'


# ============================================================================
# 3. PARKING LOT MODEL
# ============================================================================
class ParkingLot(db.Model):
    __tablename__ = 'parking_lots'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    location = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    total_spots = db.Column(db.Integer, nullable=False)
    hourly_rate = db.Column(db.Float, nullable=False)  # Price per hour
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    levels = db.relationship('ParkingLevel', back_populates='lot', cascade='all, delete-orphan')
    spots = db.relationship('ParkingSpot', back_populates='lot', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='lot', cascade='all, delete-orphan')
    ratings = db.relationship('Rating', back_populates='lot', cascade='all, delete-orphan')
    reservations = db.relationship('Reservation', back_populates='lot', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<ParkingLot {self.name}>'


# ============================================================================
# 4. PARKING LEVEL MODEL
# ============================================================================
class ParkingLevel(db.Model):
    __tablename__ = 'parking_levels'
    
    id = db.Column(db.Integer, primary_key=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    level_number = db.Column(db.String(20), nullable=False)  # 1, 2, 3, B1, B2, etc.
    floor_name = db.Column(db.String(120), nullable=True)  # Ground Floor, First Floor, etc.
    total_spots_on_level = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lot = db.relationship('ParkingLot', back_populates='levels')
    rows = db.relationship('Row', back_populates='level', cascade='all, delete-orphan')
    spots = db.relationship('ParkingSpot', back_populates='level', cascade='all, delete-orphan')
    
    __table_args__ = (db.UniqueConstraint('lot_id', 'level_number', name='unique_level_per_lot'),)
    
    def __repr__(self):
        return f'<ParkingLevel {self.level_number}>'


# ============================================================================
# 5. ROW MODEL (NEW - for camera-based scanning)
# ============================================================================
class Row(db.Model):
    __tablename__ = 'rows'
    
    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey('parking_levels.id'), nullable=False, index=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    row_letter = db.Column(db.String(10), nullable=False)  # A, B, C, etc.
    total_spots_in_row = db.Column(db.Integer, nullable=False)
    camera_id = db.Column(db.String(100), nullable=True)  # Camera identifier
    last_scan_time = db.Column(db.DateTime, nullable=True)  # Last AI scan timestamp
    last_scan_data = db.Column(db.JSON, default=dict)  # {spot_statuses from AI}
    availability_status = db.Column(db.String(50), default='scanning')  # all_available, partial, full, scanning, error
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    level = db.relationship('ParkingLevel', back_populates='rows')
    spots = db.relationship('ParkingSpot', back_populates='row', cascade='all, delete-orphan')
    
    __table_args__ = (db.UniqueConstraint('level_id', 'row_letter', name='unique_row_per_level'),)
    
    def __repr__(self):
        return f'<Row {self.row_letter}>'


# ============================================================================
# 6. PARKING SPOT MODEL
# ============================================================================
class ParkingSpot(db.Model):
    __tablename__ = 'parking_spots'
    
    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey('parking_levels.id'), nullable=False, index=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    row_id = db.Column(db.Integer, db.ForeignKey('rows.id'), nullable=False, index=True)
    spot_number = db.Column(db.String(20), nullable=False)  # A1, A2, B1, etc.
    spot_type = db.Column(db.String(50), default='regular')  # regular, disabled, vip, etc.
    status = db.Column(db.String(50), default='available')  # available, occupied, reserved, maintenance
    x_coordinate = db.Column(db.Float, nullable=True)  # For map rendering
    y_coordinate = db.Column(db.Float, nullable=True)  # For map rendering
    is_near_entrance = db.Column(db.Boolean, default=False)
    current_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    average_rating = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    level = db.relationship('ParkingLevel', back_populates='spots')
    lot = db.relationship('ParkingLot', back_populates='spots')
    row = db.relationship('Row', back_populates='spots')
    current_user = db.relationship('User', foreign_keys=[current_user_id])
    ratings = db.relationship('Rating', back_populates='spot', cascade='all, delete-orphan')
    reservations = db.relationship('Reservation', back_populates='spot', cascade='all, delete-orphan')
    
    __table_args__ = (db.UniqueConstraint('row_id', 'spot_number', name='unique_spot_per_row'),)
    
    def __repr__(self):
        return f'<ParkingSpot {self.spot_number}>'


# ============================================================================
# 7. RESERVATION MODEL
# ============================================================================
class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    spot_id = db.Column(db.Integer, db.ForeignKey('parking_spots.id'), nullable=False, index=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    reservation_start_time = db.Column(db.DateTime, nullable=False)
    reservation_end_time = db.Column(db.DateTime, nullable=True)  # When user actually leaves
    status = db.Column(db.String(50), default='active')  # active, completed, cancelled
    duration_minutes = db.Column(db.Integer, nullable=True)
    cost_calculated = db.Column(db.Float, nullable=True)
    is_paid = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='reservations')
    spot = db.relationship('ParkingSpot', back_populates='reservations')
    lot = db.relationship('ParkingLot', back_populates='reservations')
    payment = db.relationship('Payment', back_populates='reservation', uselist=False)
    contact_requests = db.relationship('ContactRequest', back_populates='reservation', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Reservation {self.id}>'


# ============================================================================
# 8. PAYMENT MODEL
# ============================================================================
class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), nullable=False, index=True, unique=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    amount = db.Column(db.Float, nullable=False)
    hourly_rate_applied = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # credit_card, debit_card, etc.
    payment_gateway_id = db.Column(db.String(255), nullable=True)  # Stripe/PayPal transaction ID
    status = db.Column(db.String(50), default='pending')  # pending, completed, failed, refunded
    payment_date = db.Column(db.DateTime, nullable=True)
    receipt_number = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='payments')
    reservation = db.relationship('Reservation', back_populates='payment')
    lot = db.relationship('ParkingLot', back_populates='payments')
    
    def __repr__(self):
        return f'<Payment {self.id}>'


# ============================================================================
# 9. RATING MODEL
# ============================================================================
class Rating(db.Model):
    __tablename__ = 'ratings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    spot_id = db.Column(db.Integer, db.ForeignKey('parking_spots.id'), nullable=False, index=True)
    lot_id = db.Column(db.Integer, db.ForeignKey('parking_lots.id'), nullable=False, index=True)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    review_text = db.Column(db.Text, nullable=True)
    aspect_rated = db.Column(db.String(100), nullable=True)  # comfort, cleanliness, safety, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='ratings')
    spot = db.relationship('ParkingSpot', back_populates='ratings')
    lot = db.relationship('ParkingLot', back_populates='ratings')
    
    def __repr__(self):
        return f'<Rating {self.id}>'


# ============================================================================
# 10. CONTACT REQUEST MODEL (for accident contact sharing)
# ============================================================================
class ContactRequest(db.Model):
    __tablename__ = 'contact_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), nullable=False, index=True)
    user_id_1 = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    user_id_2 = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True, index=True)
    license_plate_1 = db.Column(db.String(20), nullable=False)
    license_plate_2 = db.Column(db.String(20), nullable=False)
    incident_description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='open')  # open, in_progress, resolved, closed
    contact_shared_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reservation = db.relationship('Reservation', back_populates='contact_requests')
    user_1 = db.relationship('User', foreign_keys=[user_id_1], back_populates='contact_requests_1')
    user_2 = db.relationship('User', foreign_keys=[user_id_2], back_populates='contact_requests_2')
    admin = db.relationship('Admin', back_populates='contact_requests')
    
    def __repr__(self):
        return f'<ContactRequest {self.id}>'


# ============================================================================
# 11. SMS ALERT MODEL (for tracking sent alerts)
# ============================================================================
class SMSAlert(db.Model):
    __tablename__ = 'sms_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    alert_type = db.Column(db.String(50), nullable=False)  # reservation_confirmed, payment_receipt, etc.
    message_body = db.Column(db.Text, nullable=False)
    twilio_sid = db.Column(db.String(100), nullable=True)  # Twilio message ID
    status = db.Column(db.String(50), default='sent')  # sent, failed, delivered
    sent_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='sms_alerts')
    
    def __repr__(self):
        return f'<SMSAlert {self.id}>'
