# Database model for users
from flask_login import UserMixin  # Adds Flask-Login features to User model
from .extensions import db, bcrypt  # Access database and password hashing
import enum

class RoleEnum(enum.Enum):
    student = 1
    teacher = 2

class User(db.Model, UserMixin):  # Inherits from SQLAlchemy and Flask-Login
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    #role = db.Column(db.Enum(RoleEnum, validate_strings=True), nullable=False) #considor

    # Hash and store password
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Verify password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)

class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    foreignkey = db.Column(db.Integer, db.ForeignKey('quizzes.id'))
    question = db.Column(db.String(200), nullable=False)
    answer = db.Column(db.String(50), nullable=False)

    quiz = db.relationship("Quiz", backref=db.backref("questions", lazy="dynamic", collection_class=list))
