from pydantic import BaseModel, Field
from typing import List, Optional


# ✅ DTO для створення ролі
class RoleCreateDTO(BaseModel):
    name: str = Field(..., min_length=3, description="Назва ролі")
    permissions: List[str] = Field(default=[], description="Список дозволених дій")


# ✅ DTO для оновлення ролі
class RoleUpdateDTO(BaseModel):
    name: Optional[str] = Field(None, min_length=3, description="Нова назва ролі")
    permissions: Optional[List[str]] = Field(None, description="Оновлений список дозволених дій")
