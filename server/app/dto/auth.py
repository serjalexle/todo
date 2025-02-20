from pydantic import BaseModel, EmailStr

from app.models.user import User


class LoginDto(BaseModel):
    email: EmailStr
    password: str


class RegisterDto(BaseModel):
    email: EmailStr
    password: str

class RefreshResponse(BaseModel):
    status: str
    result: User