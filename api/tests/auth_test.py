import pytest  # install this dev depencency (not inlcuded in reaqurements.txt)

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# Import your app and models here
from app import create_app, db  # Adjust based on your actual app structure
from app.models import User

@pytest.fixture
def app():
    # Create a Flask app instance for testing
    app = create_app('testing')  # Use your testing configuration
    with app.app_context():
        db.create_all()  # Create all tables
        yield app
        db.drop_all()  # Drop all tables after tests

@pytest.fixture
def client(app):
    # Create a test client for the app
    return app.test_client()

@pytest.fixture
def sample_user(app):
    # Create a sample user for testing
    with app.app_context():
        user = User(username='testuser')
        user.set_password('testpassword')  # Make sure this method exists
        db.session.add(user)
        db.session.commit()
        return user

def test_signup(client):
    # Test user signup
    response = client.post('/signup', json={
        'username': 'newuser',
        'password': 'newpassword'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'

    # Test for existing user
    response = client.post('/signup', json={
        'username': 'newuser',
        'password': 'anotherpassword'
    })
    assert response.status_code == 400
    assert response.json['message'] == 'User already exists'

def test_login(client, sample_user):
    # Test user login with correct credentials
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json

    # Test user login with incorrect credentials
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert response.json['msg'] == 'Bad username or password'
