from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Import or define the Config class
from app.config import Config  # Adjust the import path if your Config class is located elsewhere

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize blockchain - CRITICAL: App won't start without blockchain connection
    try:
        config_class.init_blockchain()
        print("✓ Blockchain initialization successful - Backend ready to start")
    except (ConnectionError, FileNotFoundError, ValueError, RuntimeError) as e:
        print(f"✗ CRITICAL ERROR: {e}")
        print("✗ Backend startup ABORTED - Aptos connection required")
        raise SystemExit(f"Cannot start backend without blockchain connection: {e}")
    
    # Configure CORS
    cors.init_app(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"]
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print("JWT token expired")
        return jsonify(msg="Token has expired"), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"Invalid JWT token: {error}")
        return jsonify(msg="Invalid token"), 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"Missing JWT token: {error}")
        return jsonify(msg="Authorization header is expected"), 401
    
    # Add health check route
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'Server is running'}), 200
    
    @app.route('/')
    def home():
        return jsonify({'message': 'TRM 2.0 Backend API', 'status': 'running'}), 200
    
    # Register blueprints
    try:
        # Import route blueprints with error handling
        from app.routes.auth import auth_bp
        from app.routes.cases import cases_bp
        from app.routes.evidence import evidence_bp
        from app.routes.dashboard import dashboard_bp
        
        # Import chain of custody blueprint with fallback
        try:
            from app.routes.chain_of_custody import chain_of_custody_bp
        except ImportError as chain_error:
            print(f"Warning: Could not import chain of custody blueprint: {chain_error}")
            chain_of_custody_bp = None
        
        # Import admin blueprint separately for better error handling
        try:
            from app.routes.admin import admin_bp  # type: ignore
        except ImportError as admin_error:
            print(f"Warning: Could not import admin blueprint: {admin_error}")
            admin_bp = None

        # Register all blueprints
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(cases_bp, url_prefix='/api/cases')
        app.register_blueprint(evidence_bp, url_prefix='/api/evidence')
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
        
        if chain_of_custody_bp is not None:
            app.register_blueprint(chain_of_custody_bp)
            print("Chain of custody blueprint registered successfully")
        else:
            print("Chain of custody blueprint not available")
        
        if admin_bp is not None:
            app.register_blueprint(admin_bp, url_prefix='/api/admin')
            print("Admin blueprint registered successfully")
        else:
            print("Admin blueprint not available")
        
        # Register notifications endpoint directly
        from app.routes.dashboard import get_notifications
        app.add_url_rule('/api/notifications', 'notifications', get_notifications, methods=['GET'])
        
        print("All available blueprints registered successfully")
        
    except Exception as e:
        print(f"Error registering blueprints: {e}")
        import traceback
        traceback.print_exc()
        
    return app