from datetime import datetime, timezone
from uuid import uuid4
from beanie import Document, before_event
from pydantic import Field
from typing import List


class Role(Document):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    name: str = Field(..., description="Назва ролі")
    permissions: List[str] = Field(default=[], description="Список дозволених дій")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "roles"
        indexes = ["name"]

    def to_dict(self) -> dict:
        role_dict = self.model_dump()
        role_dict["_id"] = role_dict.pop("id")
        return role_dict

    @before_event("UPDATE")
    async def update_timestamp(self):
        """Оновлює `updated_at` перед оновленням документа"""
        self.updated_at = datetime.now(timezone.utc)
