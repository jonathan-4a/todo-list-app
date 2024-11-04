# Import necessary modules and classes
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User, ListItem, db, List

# Create a Blueprint for tasks
tasks = Blueprint('tasks', __name__)

# Root route to check if the API is working
@tasks.route('/')
def root():
    return 'api working correctly!'

# Route to create a new task
@tasks.route('/new-task', methods=['POST', 'OPTIONS'])
@jwt_required()
def create_task():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    # Get data from the request
    data = request.json
    user_id = get_jwt_identity()['identity']

    try:
        # Create a new ListItem
        new_item = ListItem(
            title=data['title'],
            list_id=data.get('list_id'),
            parent_id=data.get('parent_id'),
            user_id=user_id
        )

        # Add and commit the new item to the database
        db.session.add(new_item)
        db.session.commit()

        # Return the ID of the newly created item
        return jsonify(new_item.id), 201
    except Exception as e:
        # Rollback in case of an error
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Route to display lists
@tasks.route('/lists', methods=['GET'])
@jwt_required()
def display_lists():
    user_id = get_jwt_identity()
    user = User.query.get(user_id['identity'])
    if user:
        # Get main tasks for the user
        main_tasks = ListItem.query.filter_by(user_id=user_id['identity'], parent_id=None).all()
        return jsonify([item.serialize_hierarchy() for item in main_tasks]), 200
    return jsonify({'error': 'User not found'}), 404

# Route to get lists
@tasks.route('/get-lists', methods=['GET'])
@jwt_required()
def get_lists():
    user_id = get_jwt_identity()
    lists = List.query.filter_by(user_id=user_id['identity']).all()
    return jsonify([list.serialize() for list in lists]), 200

# Route to edit a task
@tasks.route('/edit-task', methods=['PUT', 'OPTIONS'])
@jwt_required()
def edit_task():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    user_id = get_jwt_identity()['identity']
    task_data = request.json
    task_id = task_data.get('id')
    new_title = task_data.get('title')

    if not task_id or new_title is None:
        return jsonify({'error': 'Missing task ID or new title'}), 400

    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()
    if task:
        task.title = new_title
        db.session.commit()
        return jsonify({'message': 'Task updated successfully'}), 200
    else:
        return jsonify({'error': 'Task not found or not authorized to edit this task'}), 404

# Function to delete sub-items recursively
def delete_sub_items(task_id):
    sub_items = ListItem.query.filter_by(parent_id=task_id).all()
    for sub_item in sub_items:
        delete_sub_items(sub_item.id)
        db.session.delete(sub_item)

# Route to delete a task
@tasks.route('/delete-task/<int:task_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_task(task_id):
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    user_id = get_jwt_identity()['identity']
    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()
    if task:
        delete_sub_items(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task and all sub-tasks deleted successfully'}), 200
    else:
        return jsonify({'error': 'Task not found or not authorized to delete this task'}), 404

# Route to create a new list
@tasks.route('/create-list', methods=['POST', 'OPTIONS'])
@jwt_required()
def create_list():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    data = request.get_json()
    list_name = data.get('name')
    user_id = get_jwt_identity()['identity']
    new_list = List(name=list_name, user_id=user_id)
    db.session.add(new_list)
    db.session.commit()

    new_list

    return jsonify(new_list.serialize()), 201

# Route to delete a list
@tasks.route('/delete-list/<int:list_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_list(list_id):
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    user_id = get_jwt_identity()['identity']
    list = List.query.filter_by(id=list_id, user_id=user_id).first()
    if list:
        db.session.delete(list)
        db.session.commit()
        return jsonify({'message': 'List deleted successfully'}), 200
    else:
        return jsonify({'error': 'List not found or not authorized to delete this list'}), 404

# Route to move a task to a new list
@tasks.route('/move-task/<int:task_id>/<int:new_list_id>', methods=['PUT', 'OPTIONS'])
@jwt_required()
def change_task_list(task_id, new_list_id):
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    user_id = get_jwt_identity()['identity']
    # Verify the new list belongs to the user
    new_list = List.query.filter_by(id=new_list_id, user_id=user_id).first()
    if not new_list:
        return jsonify({'error': 'New list not found or not authorized to add tasks to this list'}), 404

    task = ListItem.query.filter_by(id=task_id, user_id=user_id).first()

    subtasks = ListItem.query.filter_by(parent_id=task_id).all()
    subsubtasks = []
    for t in subtasks:
        subsubtasks += ListItem.query.filter_by(parent_id=t.id).all()
    tasks_to_update = [task] + subtasks + subsubtasks
    for task_to_update in tasks_to_update:
        task_to_update.list_id = new_list_id

    db.session.commit()
    return jsonify({'message': 'Task and its children moved successfully'}), 200

# Route to move a task between tasks
@tasks.route('/move-between-tasks', methods=['PUT', 'OPTIONS'])
@jwt_required()
def move_between_tasks():
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    data = request.get_json()
    src_task_id = data.get('src_task_id')
    new_parent_id = data.get('parent_id')
    user_id = get_jwt_identity()['identity']

    task = ListItem.query.filter_by(id=src_task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Task not found or not authorized'}), 404

    task.parent_id = new_parent_id
    db.session.commit()

    return jsonify({'message': 'Task moved successfully'}), 200
