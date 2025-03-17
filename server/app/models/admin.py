from datetime import datetime, timezone
from uuid import uuid4

from beanie import Document, before_event
from pydantic import Field, EmailStr
from typing import List


class Admin(Document):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    password: str
    role: str = Field(default="moderator", description="Роль адміністратора (superadmin/moderator)")
    permissions: List[str] = Field(default_factory=list, description="Список дозволених дій")

    class Settings:
        name = "admins"
        indexes = ["email", "role"]

    def to_dict(self, exclude_password: bool = True) -> dict:
        """
        Метод, який конвертує об'єкт у словник і за необхідності виключає пароль.
        """
        admin_dict = self.model_dump()
        admin_dict["_id"] = admin_dict.pop("id")

        if exclude_password:
            admin_dict.pop("password", None)
        return admin_dict

    @before_event("UPDATE")
    async def update_timestamp(self):
        """Оновлює `updated_at` перед оновленням документа"""
        self.updated_at = datetime.now(timezone.utc)
