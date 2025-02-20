import os

from dotenv import load_dotenv

load_dotenv()


class ENVSettings:
    # ? MongoDB Config
    MONGO_PREFIX: str = os.environ.get("MONGO_PREFIX", "mongodb://")
    MONGO_HOST: str = os.environ.get("MONGO_HOST", "localhost")
    MONGO_PORT: str = os.environ.get("MONGO_PORT", "27017")
    MONGO_DB: str = os.environ.get("MONGO_DB", "todo-local-db")
    # ? Auth Config
    JWT_KEY: str = os.environ.get("JWT_KEY", "your_secret_key")


def get_db_url():
    return f"{ENVSettings.MONGO_PREFIX}{ENVSettings.MONGO_HOST}:{ENVSettings.MONGO_PORT}/{ENVSettings.MONGO_DB}"
