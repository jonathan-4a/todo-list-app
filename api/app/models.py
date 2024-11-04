from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    
    # Relationships to ListItem and List models
    list_items = db.relationship('ListItem', backref='user', lazy='dynamic')
    lists = db.relationship('List', backref='user', lazy='dynamic')

    # Set hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    # Check hashed password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Relationship with ListItem and foreign key to User
    items = db.relationship('ListItem', backref='list', lazy=True, cascade="all, delete-orphan")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Serialize list for API responses
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }

class ListItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    
    # Parent item relationship to support hierarchy
    parent_id = db.Column(db.Integer, db.ForeignKey('list_item.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    
    # Recursive relationship for sub-items
    sub_items = db.relationship('ListItem', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    # Serialize hierarchy for nested items
    def serialize_hierarchy(self):
        return {
            'id': self.id,
            'title': self.title,
            'list_id': self.list_id,
            'sub_items': [sub_item.serialize_hierarchy() for sub_item in self.sub_items]
        }
