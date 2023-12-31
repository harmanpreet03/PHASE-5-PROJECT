"""Added default UUID to account_number

Revision ID: 377bc1b38627
Revises: 57063979d645
Create Date: 2023-10-31 21:12:38.181567

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '377bc1b38627'
down_revision = '57063979d645'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('account', schema=None) as batch_op:
        batch_op.alter_column('account_number',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.String(length=36),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('account', schema=None) as batch_op:
        batch_op.alter_column('account_number',
               existing_type=sa.String(length=36),
               type_=sa.VARCHAR(length=20),
               existing_nullable=False)

    # ### end Alembic commands ###
