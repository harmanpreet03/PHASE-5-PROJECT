# services/transaction_service.py

from app import db
from app.models import Transaction, Account


class TransactionService:
    def make_transaction(self, account_id, amount, description):
        # Retrieve the account by ID
        account = Account.query.get(account_id)
        if account:
            # Create a new transaction
            transaction = Transaction(
                account_id=account.id, amount=amount, description=description
            )

            account.balance += amount  # For a deposit, subtract for a withdrawal
            db.session.add(transaction)
            db.session.commit()

            return True, "Transaction successful"

        return False, "Account not found"

    def get_transaction(self, transaction_id):
        return Transaction.query.get(transaction_id)

    def list_transactions_by_account(self, account_id):
        return Transaction.query.filter_by(account_id=account_id).all()

    def get_account_id_from_number(self, account_number):
        account = Account.query.filter_by(account_number=account_number).first()
        # If the account exists, return its ID, otherwise return None
        return account.id if account else None
