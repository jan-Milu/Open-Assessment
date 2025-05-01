from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'
app.config['SECRET_KEY'] = '2185659fd75aaecf811884400985fdd81556374987fbb4cd'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

from myapp import routes, models