from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# ✅ DTO для створення користувача
class UserCreateDTO(BaseModel):
    email: EmailStr = Field(..., description="Електронна пошта користувача")
    password: str = Field(..., min_length=6, description="Пароль користувача")


# ✅ DTO для оновлення користувача
class UserUpdateDTO(BaseModel):
    email: Optional[EmailStr] = Field(
        None, description="Нова електронна пошта користувача"
    )
    password: Optional[str] = Field(
        None, min_length=6, description="Новий пароль користувача"
    )
