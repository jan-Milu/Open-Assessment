from myapp import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    is_complete = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=0)

