from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from uuid import uuid4


class RefreshToken(Document):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str
    token: str
    expires_at: datetime

    class Settings:
        name = "refresh_tokens"
