import pytest # install this dev depencency (not inlcuded in reaqurements.txt)
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from app import create_app, db  # Adjust this import based on your app structure
from app.models import User, List, ListItem

@pytest.fixture
def app():
    app = create_app('testing')  # Create your app with testing config
    with app.app_context():
        db.create_all()  # Create tables
        yield app
        db.drop_all()  # Clean up after tests

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def sample_user(client):
    # Create a sample user and log in to get a token
    response = client.post('/signup', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 201

    login_response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert login_response.status_code == 200
    return login_response.json['access_token']

def test_create_task(client, sample_user):
    # Test creating a task
    response = client.post('/new-task', json={'title': 'New Task'}, headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 201
    assert isinstance(response.json, int)  # Check if the response is an ID

def test_edit_task(client, sample_user):
    # First, create a task to edit
    response = client.post('/new-task', json={'title': 'Task to Edit'}, headers={'Authorization': f'Bearer {sample_user}'})
    task_id = response.json

    # Now edit the task
    response = client.put('/edit-task', json={'id': task_id, 'title': 'Edited Task Title'}, headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 200
    assert response.json['message'] == 'Task updated successfully'

def test_delete_task(client, sample_user):
    # Create a task to delete
    response = client.post('/new-task', json={'title': 'Task to Delete'}, headers={'Authorization': f'Bearer {sample_user}'})
    task_id = response.json

    # Now delete the task
    response = client.delete(f'/delete-task/{task_id}', headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 200
    assert response.json['message'] == 'Task and all sub-tasks deleted successfully'

def test_create_list(client, sample_user):
    # Test creating a list
    response = client.post('/create-list', json={'name': 'New List'}, headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 201
    assert 'id' in response.json  # Check if the response contains the new list's ID

def test_delete_list(client, sample_user):
    # Create a list to delete
    response = client.post('/create-list', json={'name': 'List to Delete'}, headers={'Authorization': f'Bearer {sample_user}'})
    list_id = response.json['id']

    # Now delete the list
    response = client.delete(f'/delete-list/{list_id}', headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 200
    assert response.json['message'] == 'List deleted successfully'

def test_move_task(client, sample_user):
    # Create a list to move a task into
    response = client.post('/create-list', json={'name': 'List for Moving Tasks'}, headers={'Authorization': f'Bearer {sample_user}'})
    new_list_id = response.json['id']

    # Create a task to move
    response = client.post('/new-task', json={'title': 'Task to Move'}, headers={'Authorization': f'Bearer {sample_user}'})
    task_id = response.json

    # Now move the task to the new list
    response = client.put(f'/move-task/{task_id}/{new_list_id}', headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 200
    assert response.json['message'] == 'Task and its children moved successfully'

def test_move_between_tasks(client, sample_user):
    # Create a task to move
    response = client.post('/new-task', json={'title': 'Parent Task'}, headers={'Authorization': f'Bearer {sample_user}'})
    parent_task_id = response.json

    # Create a sub-task
    response = client.post('/new-task', json={'title': 'Child Task', 'parent_id': parent_task_id}, headers={'Authorization': f'Bearer {sample_user}'})
    child_task_id = response.json

    # Move the child task to a new parent
    response = client.put('/move-between-tasks', json={'src_task_id': child_task_id, 'parent_id': parent_task_id}, headers={'Authorization': f'Bearer {sample_user}'})
    assert response.status_code == 200
    assert response.json['message'] == 'Task moved successfully'
