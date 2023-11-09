# services/account_service.py
from app.models import Account  # import the Account model


class AccountService:
    def get_account(self, account_number):
        account = Account.query.filter_by(account_number=account_number).first()
        if account:
            return {
                "account_number": account.account_number,
                "balance": account.balance,
            }
        return None

    def edit_account(self, account_number, new_balance):
        """
        Edit the balance of an account.

        Parameters:
        - account_number (str): The account number of the account to edit.
        - new_balance (float): The new balance to set for the account.

        Returns:
        - dict: The edited account details.
        - None: If the account doesn't exist.
        """
        account = Account.query.filter_by(account_number=account_number).first()
        if account:
            account["balance"] = new_balance
            return account
        return None


def get_account_id_from_number(account_number):
    """
    Retrieve an account ID based on the account number.

    :param account_number: The string representation of the account number (UUID).
    :return: The account ID if found, otherwise None.
    """
    account = Account.query.filter_by(account_number=account_number).first()
    return account.id if account else None
