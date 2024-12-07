import os

from dotenv import load_dotenv

load_dotenv()


class ENVSettings:
    MONGODB_URL: str = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
    JWT_KEY: str = os.environ.get("JWT_KEY", "your_secret_key")

    @staticmethod
    def get_db_url():
        return os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
