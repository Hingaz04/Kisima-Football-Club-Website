"""Academy News Model added

Revision ID: 5cc734f238bf
Revises: 99a1fb8814c6
Create Date: 2024-09-04 12:33:56.520402

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5cc734f238bf'
down_revision = '99a1fb8814c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('academy_news',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('image', sa.String(length=100), nullable=True),
    sa.Column('date', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('academy_news')
    # ### end Alembic commands ###
