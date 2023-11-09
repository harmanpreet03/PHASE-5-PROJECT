# routes/transaction_routes.py

from . import transaction_bp
from app.services.transaction_service import TransactionService
from flask import jsonify
from app.services.account_service import get_account_id_from_number

transaction_service = TransactionService()


@transaction_bp.route("/<account_number>/deposit/<int:amount>", methods=["POST"])
def make_deposit_transaction(account_number, amount):
    # Convert account_number to account_id which is a number
    account_id = get_account_id_from_number(account_number)

    if account_id is None:
        return jsonify({"error": "Account not found"}), 404

    success, message = transaction_service.make_transaction(
        account_id, amount, "Deposit"
    )
    if success:
        return jsonify({"message": message})
    return jsonify({"error": "Failed to make transaction"}), 400


@transaction_bp.route("/<account_number>/withdrawal/<int:amount>", methods=["POST"])
def make_withdrawal_transaction(account_number, amount):
    # Convert the account number to account_id
    account_id = get_account_id_from_number(account_number)

    if account_id is None:
        return jsonify({"error": "Account not found"}), 404

    # Since it's a withdrawal, the amount should be negative
    success, message = transaction_service.make_transaction(
        account_id, -amount, "Withdrawal"
    )

    if success:
        return jsonify({"message": message})
    return jsonify({"error": "Failed to make transaction"}), 400


@transaction_bp.route("/transaction/<int:transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    transaction = transaction_service.get_transaction(transaction_id)
    if transaction:
        return jsonify(
            {
                "transaction_id": transaction.id,
                "account_number": transaction.account_number,
                "amount": transaction.amount,
                "user_id": transaction.user_id,
            }
        )
    return jsonify({"error": "Transaction not found"}), 404


@transaction_bp.route("/account/<account_number>", methods=["GET"])
def list_transactions(account_number):
    account_id = transaction_service.get_account_id_from_number(account_number)

    if account_id is None:
        return jsonify({"error": "Account not found"}), 404

    transactions = transaction_service.list_transactions_by_account(account_id)

    return jsonify(
        [
            {
                "transaction_id": txn.id,
                "account_number": txn.account.account_number,  # Access account number through the account relationship
                "amount": txn.amount,
                "user_id": txn.account.user_id,  # Access user ID through the account relationship
                "date_posted": txn.date_posted.isoformat(),  # Format datetime to string
                "description": txn.description,
            }
            for txn in transactions
        ]
    )
