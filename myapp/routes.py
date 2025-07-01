# All app routes (register, login, dashboard, logout)
from flask import render_template, redirect, url_for, flash, request, jsonify
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
        #if current_user.is_authenticated:
        #    return redirect(url_for('dashboard'))
        form = RegistrationForm()
        if form.validate_on_submit():
            # Create user and hash password
            valid_pass = validate_password(form.password.data)
            print(valid_pass)
            if valid_pass[0]:
                user = User(username=form.username.data, email=form.email.data)
                user.set_password(form.password.data)
                db.session.add(user)
                db.session.commit()
                print("hi??")
                flash('Account created!', 'success')
                login_user(user)
                return redirect(url_for('dashboard'))
            else:
                for msg in valid_pass[1]: flash(msg) 
        return render_template('register.html', form=form)

    def validate_password(password):
        problems = []
        if not any(c.isupper() for c in password): problems.append("Password must contain at least 1 captial letter")
        if not any(c.islower() for c in password): problems.append("Password must contain at least 1 lowercase letter")
        if not any(c.isdigit() for c in password): problems.append("Password must contain at least 1 number")

        return len(problems) == 0, problems

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

    #@app.route('/createquiz', methods=['GET', 'POST'])
    #@login_required
    def createquiz():
        from .models import Quiz, Question
        form = QuizCreationForm()
        template_form = QuestionForm(prefix='question-_-')
        if form.validate_on_submit():
            quiz = Quiz(title=form.title.data)

            db.session.add(quiz)

            print(form.questions.data)

            for question in form.questions.data:
                q = Question(**question)
                print(q)

                quiz.questions.append(q)

            db.session.commit()

            return redirect(url_for('dashboard'))
        return render_template('quizcreator.html', form=form, _template=template_form, page="quizcreator")

    #@app.route('/play')
    #def play():
    #    return render_template('game.html')

    @app.route('/quizsnake')
    @login_required
    def quizsnake():
        return render_template('quizsnake.html', page="default")

    @app.route('/quizsnake/<page>', methods=['GET', 'POST'])
    @login_required
    def quizsnake_subpage(page):
        if page == "play":
            return render_template('selectgame.html', page=page)

        if page == "game":
            return render_template('game.html', page="play")

        if page == "createquiz":
            from .models import Quiz, Question
            form = QuizCreationForm()
            template_form = QuestionForm(prefix='questions-_-')
            if form.validate_on_submit():
                quiz = Quiz(title=form.title.data)

                db.session.add(quiz)

                print(form)
                print(quiz.questions)

                for question in form.questions.data:
                    
                    q = Question(**question)

                    print(q)
                    print(question)

                    quiz.questions.append(q)
                print(quiz.questions)

                db.session.commit()

                return redirect(url_for('dashboard'))
            return render_template('quizcreator.html', page="quizcreator", form=form, _template=template_form)

    @app.route('/')
    @login_required
    def dashboard():
        return f'Hello, {current_user.username}!'  # Simple landing page


    @app.route('/get_quizzes/<string:term>', methods=['GET', 'POST'])
    def get_quizzes(term):
        from .models import Quiz, Question
        quizzes = Quiz.query.filter(Quiz.title.contains(term))
        result = [{"id": q.id, "title": q.title} for q in quizzes]
        return jsonify(result)

    @app.route('/get_questions/<int:id>', methods=['GET', 'POST'])
    def get_questions(id):
        from .models import Question
        questions = Question.query.filter(Question.foreignkey == id)
        result = [{"question": q.question, "answer": q.answer, "false_answers": [q.falseanswer1, q.falseanswer2, q.falseanswer3]} for q in questions]
        a = jsonify(result)
        print(a)
        return a     
