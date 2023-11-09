# services/user_service.py

from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User, Account


class UserService:
    @staticmethod
    def register_user(username, email, password):
        hashed_password = generate_password_hash(password, method="sha256")
        new_user = User(username=username, email=email, password=hashed_password)

        # Create an account for the user
        initial_balance = 1000000  # $1,000,000
        new_account = Account(balance=initial_balance, owner=new_user)

        db.session.add(new_user)
        db.session.add(new_account)
        db.session.commit()

        return {
            "user_id": new_user.id,
            "username": new_user.username,
            "account_number": new_account.account_number,
            "message": "User registered successfully",
        }

    @staticmethod
    def ensure_user_has_account(user):
        """Ensure the user has an account, and if not, create one."""
        if not user.accounts:
            initial_balance = 1000000  # $1,000,000
            new_account = Account(balance=initial_balance, owner=user)
            db.session.add(new_account)
            db.session.commit()

    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()

        # The user exists and the password is correct
        if user and check_password_hash(user.password, password):
            # Ensure the user has an account
            UserService.ensure_user_has_account(user)
            
            account_number = user.accounts[0].account_number if user.accounts else None

            return {
                "user_id": user.id,
                "username": user.username,
                "account_number": account_number,
                "message": "Login successful",
            }

        # If user doesn't exist or password is incorrect, return None
        return None
