from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


# ✅ DTO для створення адміністратора
class AdminCreateDTO(BaseModel):
    email: EmailStr = Field(..., description="Електронна пошта адміністратора")
    password: str = Field(..., min_length=6, description="Пароль адміністратора")
    role_id: str = Field(..., description="ID ролі адміністратора")
    custom_permissions: List[str] = Field(
        default=[], description="Список дозволених дій"
    )



# ✅ DTO для оновлення адміністратора
class AdminUpdateDTO(BaseModel):
    email: Optional[EmailStr] = Field(
        None, description="Нова електронна пошта адміністратора"
    )
    password: Optional[str] = Field(
        None, min_length=6, description="Новий пароль адміністратора"
    )
    role_id: Optional[str] = Field(None, description="Новий ID ролі адміністратора")
    custom_permissions: Optional[List[str]] = Field(
        None, description="Оновлений список дозволених дій"
    )
