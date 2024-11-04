from flask import Flask
from .models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .auth import auth as auth_blueprint
from .tasks import tasks as tasks_blueprint

# Initialize JWT manager
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app)
    
    # Configure database and JWT secret key
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
    app.config['JWT_SECRET_KEY'] = r"?]3VleO7GqamB7Y&#.|3'/8jtWA*VDjp"
    
    # Initialize JWT and database with app
    jwt.init_app(app)
    db.init_app(app)
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    # Register blueprints for authentication and task routes
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(tasks_blueprint)

    return app

if __name__ == '__main__':
    # Run the application in debug mode
    app = create_app()
    app.run(debug=True)
