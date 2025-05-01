from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField, BooleanField, IntegerField
from wtforms.validators import InputRequired, Length

class TaskForm(FlaskForm):
    title = StringField('Title', validators=[InputRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[Length(max=200)])
    is_complete = BooleanField('Completed')
    priority = IntegerField('Priority', validators = [InputRequired()])
    submit = SubmitField('Submit')
    