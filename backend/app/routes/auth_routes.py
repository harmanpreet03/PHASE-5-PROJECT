# routes/auth_routes.py

from flask import request, jsonify
from app import app
from app.models import User
from app.services.user_service import UserService
from . import auth_bp


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    response = UserService.register_user(username, email, password)

    if response and "user_id" in response:
        return jsonify(response), 201  # Return the response dictionary as JSON
    else:
        return jsonify({"error": "Registration failed"}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    print(email)
    user_info = UserService.authenticate_user(email, password)
    # print the user_info
    print(user_info)
    if user_info:
        return jsonify(user_info), 200  # Return the user_info dictionary as JSON
    else:
        return jsonify({"error": "Invalid email or password"}), 401
