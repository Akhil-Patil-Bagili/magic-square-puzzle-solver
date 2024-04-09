"""Increase password hash length

Revision ID: 2402897f770a
Revises: bafddbf5a9db
Create Date: 2024-03-26 15:54:48.698529

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2402897f770a'
down_revision = 'bafddbf5a9db'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('password_hash',
               existing_type=sa.VARCHAR(length=128),
               type_=sa.String(length=512),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('password_hash',
               existing_type=sa.String(length=512),
               type_=sa.VARCHAR(length=128),
               existing_nullable=False)

    # ### end Alembic commands ###