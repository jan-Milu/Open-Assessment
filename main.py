from flask import Flask, render_template, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField, BooleanField
from wtforms.validators import InputRequired, Length

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
app.config['SECRET_KEY'] = '2185659fd75aaecf811884400985fdd81556374987fbb4cd'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    is_complete = db.Column(db.Boolean, default=False)

class TaskForm(FlaskForm):
    title = StringField('Title', validators=[InputRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[Length(max=200)])
    is_complete = BooleanField('Completed')
    submit = SubmitField('Submit')

@app.route('/task', methods=['GET', 'POST'])
def task():
    form = TaskForm()
    if form.validate_on_submit():
        new_task = Task(
            title = form.title.data,
            description = form.description.data,
            is_complete = form.is_complete.data
        )
        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for('display_tasks'))
    return render_template('task.html', form = form)


@app.route('/task/list/')
def display_tasks():
    tasks = Task.query.all()
    return render_template('task_list.html',tasks=tasks)

@app.route('/task/update_status/<int:task_id>', methods = ["POST"])
def update_task_status(task_id):
    task = Task.query.get_or_404(task_id)
    task.is_complete = 'is_complete' in request.form
    db.session.commit()
    return redirect(url_for('display_tasks'))

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/user/<name>')
def user(name):
    personal = f'<h1> Hello, {name}! </h1>'
    instruc = '<p> Change the name in the <em> browser address bar </em> and reload page,</p>'
    return personal + instruc

@app.route("/hello/<name>")
def hello(name):
    return render_template('hello.html', name = name)

@app.route('/users')
def users():
    user_names = ['Angus', 'Isaac', 'Milo', 'Brandan']
    return render_template('users.html', names=user_names)








if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5000, debug=True)

