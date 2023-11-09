# routes/__init__.py

from flask import Blueprint

auth_bp = Blueprint('auth', __name__ )
account_bp = Blueprint('account', __name__)
transaction_bp = Blueprint('transaction', __name__)

# Importing the account routes to ensure the routes get registered
from . import account_routes
from . import transaction_routes
from . import auth_routes

