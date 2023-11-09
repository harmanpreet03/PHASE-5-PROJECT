# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database
db = SQLAlchemy(app)

# Initialize Flask-Migrate (only if you want to use it)
migrate = Migrate(app, db)

from app.routes import account_bp, transaction_bp, auth_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(account_bp, url_prefix='/accounts')
app.register_blueprint(transaction_bp, url_prefix='/transactions')

# Import models AFTER initializing db to avoid circular imports
from app import models

@app.errorhandler(404)
def page_not_found(e):
    return "404 - The requested page could not be found.", 404
