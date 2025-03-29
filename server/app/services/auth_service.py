# app/services/auth_service.py

from datetime import timedelta, datetime, timezone
from fastapi import HTTPException, status, Response
from app.models.admin import Admin
from app.models.token import RefreshToken
from app.utils.common import generate_jwt, verify_jwt, hash_password, verify_password
from app.models.user import User


async def authenticate_user(email: str, password: str):
    user = await User.find_one({"email": email})
    print(f"User found: {user.password} {password}")
    # Перевіряємо, чи існує користувач з таким email
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or password is incorrect",
        )
    return user


async def authenticate_admin(email: str, password: str):
    admin = await Admin.find_one({"email": email})
    if not admin or not verify_password(password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or password is incorrect",
        )
    return admin


# Створення пари токенів
async def create_tokens(user_id: str):
    access_token = generate_jwt(user_id, expires_delta=timedelta(hours=1))
    refresh_token = generate_jwt(user_id, expires_delta=timedelta(days=7))

    # Збереження рефреш-токена в БД
    refresh_token_entry = RefreshToken(
        user_id=user_id,
        token=refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    await refresh_token_entry.insert()

    return access_token, refresh_token


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=3600,
        secure=True,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=86400,
        secure=True,
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def refresh_access_token(refresh_token: str, current_user_id: str):
    """Оновлює access_token, перевіряючи рефреш-токен у БД"""

    # Перевіряємо валідність JWT
    payload = verify_jwt(refresh_token)
    if not payload or payload["user_id"] != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Перевіряємо, чи токен є в БД
    token_entry = await RefreshToken.find_one(RefreshToken.token == refresh_token)
    if not token_entry:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found",
        )

    # Генеруємо нові токени
    new_access_token, new_refresh_token = await create_tokens(payload["user_id"])

    # Видаляємо старий рефреш-токен і записуємо новий
    await token_entry.delete()

    new_token_entry = RefreshToken(
        user_id=payload["user_id"],
        token=new_refresh_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    await new_token_entry.insert()

    return new_access_token, new_refresh_token
