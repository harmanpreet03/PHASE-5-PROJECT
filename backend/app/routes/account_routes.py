# routes/account_routes.py

from . import account_bp
from app.services.account_service import AccountService
from flask import jsonify

account_service = AccountService()


@account_bp.route("/<account_number>", methods=["GET"])
def get_account(account_number):
    account = account_service.get_account(account_number)
    if account:
        return jsonify(account)
    return jsonify({"error": "Account not found"}), 404
