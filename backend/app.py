"""
Smart Parking System - Flask Application Entry Point
====================================================

This is the main Flask application file where the app is initialized,
blueprints are registered, and server configuration is set.
"""

from flask import Flask
from flask_cors import CORS
from config import Config, DevelopmentConfig
from models import db

# TODO: Import blueprints
# from auth import auth_bp
# from parking_spots import spots_bp
# from payments import payments_bp
# from admin import admin_bp


def create_app(config_class=DevelopmentConfig):
    """
    Application factory function.
    
    Creates and configures Flask app instance with:
    - Database initialization
    - CORS setup
    - Blueprint registration
    - Error handlers
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Register blueprints (TODO: uncomment when blueprints are ready)
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(spots_bp)
    # app.register_blueprint(payments_bp)
    # app.register_blueprint(admin_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
