"""
Configuration File for Smart Parking System
===========================================

Manages environment variables, database connections, API keys, and other configs.
"""

import os
from datetime import timedelta

class Config:
    """
    Base configuration class
    
    TODO: Configure:
    - MySQL database connection string
    - Flask secret key
    - Session timeout
    - CORS settings
    - JWT/Authentication settings
    - Twilio credentials (SMS)
    - Payment gateway credentials (Stripe/PayPal)
    - API rate limiting
    """
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+pymysql://root:password@localhost/smart_parking')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Authentication
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Twilio (SMS)
    TWILIO_ACCOUNT_SID = None  # TODO: Set from env
    TWILIO_AUTH_TOKEN = None   # TODO: Set from env
    TWILIO_PHONE_NUMBER = None  # TODO: Set from env
    
    # Payment Gateway
    STRIPE_SECRET_KEY = None   # TODO: Set from env
    STRIPE_PUBLISHABLE_KEY = None  # TODO: Set from env
    
    # AI Data Generation
    AI_DATA_REFRESH_INTERVAL = 10  # Seconds between random spot updates
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
