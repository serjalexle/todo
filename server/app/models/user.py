from datetime import datetime, timezone
from uuid import uuid4


from beanie import Document, before_event
from pydantic import Field, EmailStr

from bson import ObjectId


class User(Document):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    password: str

    class Settings:
        name = "users"
        indexes = ["email"]

    def to_dict(self, exclude_password: bool = True) -> dict:
        """
        Метод, який конвертує об'єкт у словник і за необхідності виключає пароль.
        """
        user_dict = self.model_dump()
        # replace id with _id
        user_dict["_id"] = user_dict.pop("id")

        if exclude_password:
            user_dict.pop("password", None)
        return user_dict

    @before_event("UPDATE")
    async def update_timestamp(self):
        """Оновлює `updated_at` перед оновленням документа"""
        self.updated_at = datetime.now(timezone.utc)
