# app/services/auth_service.py

from datetime import timedelta, datetime, timezone
from fastapi import HTTPException, status, Response
from app.utils.common import generate_jwt, verify_jwt, hash_password, verify_password
from app.models.user import User


async def authenticate_user(email: str, password: str):
    user = await User.find_one({"email": email})
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect",
        )
    return user


def create_tokens(user_id: str):
    access_token = generate_jwt(user_id, expires_delta=timedelta(hours=1))
    refresh_token = generate_jwt(user_id, expires_delta=timedelta(days=1))
    return access_token, refresh_token


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=3600, secure=True)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, max_age=86400, secure=True)


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def refresh_access_token(refresh_token: str, current_user_id: str):
    payload = verify_jwt(refresh_token)
    if not payload or payload["user_id"] != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    new_access_token, new_refresh_token = create_tokens(payload["user_id"])
    return new_access_token, new_refresh_token
