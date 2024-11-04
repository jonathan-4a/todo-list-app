from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from .models import User, db
import datetime

# Define authentication blueprint
auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    try:
        # Handle CORS preflight request
        if request.method == 'OPTIONS':
            return jsonify(success=True), 200
        
        # Get JSON data from request
        data = request.get_json()
        print("Received data:", data)
        
        username = data.get('username')
        password = data.get('password')

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'User already exists'}), 400

        # Create a new user and set password
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)  # Add new user to session
        db.session.commit()  # Commit transaction

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)  # Log error
        return jsonify({'error': 'Internal Server Error'}), 500

@auth.route('/login', methods=['POST', 'OPTIONS'])
def login():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    
    delta = datetime.timedelta(days=15)  # Token expiration time
    data = request.get_json()
    
    # Verify user credentials
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        user_identity = {'identity': user.id}  # User identity for token
        access_token = create_access_token(identity=user_identity, expires_delta=delta)
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad username or password"}), 401
