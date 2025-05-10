# Database model for users
from flask_login import UserMixin  # Adds Flask-Login features to User model
from .extensions import db, bcrypt  # Access database and password hashing

class User(db.Model, UserMixin):  # Inherits from SQLAlchemy and Flask-Login
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Hash and store password
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Verify password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
