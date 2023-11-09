# app/config.py or wherever you manage your configurations

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'  # SQLite database named site.db in the project root
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # This will turn off the modification tracking feature of Flask-SQLAlchemy which is not needed in most cases and consumes extra memory.
