# All app routes (register, login, dashboard, logout)
from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from .forms import RegistrationForm, LoginForm, QuizCreationForm, QuestionForm
from .extensions import db, login_manager

def init_routes(app):
    from .models import User  # Deferred import to avoid circular dependency

    @login_manager.user_loader
    def load_user(user_id):
        # Flask-Login uses this to reload user from session
        return User.query.get(int(user_id))

    @app.route('/register', methods=['GET', 'POST'])
    def register():
        from .models import User  # Safe local import
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        form = RegistrationForm()
        if form.validate_on_submit():
            # Create user and hash password
            user = User(username=form.username.data, email=form.email.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            print("hi??")
            flash('Account created!', 'success')
            login_user(user)
            return redirect(url_for('dashboard'))
        return render_template('register.html', form=form)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        from .models import User  # Safe local import
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user and user.check_password(form.password.data):
                login_user(user)
                return redirect(url_for('dashboard'))
            flash('Invalid credentials.', 'danger')
        return render_template('login.html', form=form)

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))

    @app.route('/createquiz', methods=['GET', 'POST'])
    @login_required
    def createquiz():
        from .models import Quiz, Question
        form = QuizCreationForm()
        template_form = QuestionForm(prefix='question-_-')
        if form.validate_on_submit():
            quiz = Quiz(title=form.title.data)

            db.session.add(quiz)

            for question in form.questions.data:
                q = Question(**question)

                quiz.questions.append(q)

            db.session.commit()

            return redirect(url_for('dashboard'))
        return render_template('quizcreator.html', form=form, _template=template_form)

    @app.route('/play')
    def play():
        return render_template('game.html')

    @app.route('/')
    @login_required
    def dashboard():
        return f'Hello, {current_user.username}!'  # Simple landing page
