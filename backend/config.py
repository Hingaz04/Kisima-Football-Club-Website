from datetime import timedelta
from decouple import config

class Config:
    SECRET_KEY = config("SECRET_KEY", default="super-secret-key")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = config("DATABASE_URL")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)

    DEBUG = config("DEBUG", default=False, cast=bool)