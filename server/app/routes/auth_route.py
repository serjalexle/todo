# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.common.errors import AppErrors
from app.dto.auth import LoginDto, RefreshResponse, RegisterDto
from app.middleware.common import get_current_user
from app.models.user import User
from app.services.auth_service import (
    authenticate_user,
    create_tokens,
    set_auth_cookies,
    clear_auth_cookies,
    refresh_access_token,
)
from app.utils.common import hash_password

auth_router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"],
)


@auth_router.post("/login")
async def login(login_data: LoginDto, response: Response):
    user = await authenticate_user(login_data.email, login_data.password)
    access_token, refresh_token = create_tokens(user.id)
    set_auth_cookies(response, access_token, refresh_token)
    return {
        "status": "success",
        "result": User.to_dict(user, exclude_password=True),
    }


@auth_router.post("/register")
async def register(register_data: RegisterDto, response: Response):
    existing_user = await User.find_one({"email": register_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    hashed_password = hash_password(register_data.password)
    new_user = User(email=register_data.email, password=hashed_password)
    created_user = await User.insert_one(new_user)

    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User was not created, try again",
        )

    access_token, refresh_token = create_tokens(created_user.id)
    set_auth_cookies(response, access_token, refresh_token)

    return {
        "status": "success",
        "result": User.to_dict(created_user, exclude_password=True),
    }


@auth_router.get("/logout")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {
        "status": "success",
        "result": "Logged out successfully",
    }


@auth_router.get(
    "/refresh",
    response_model=RefreshResponse,
)
async def refresh(
    response: Response, request: Request, current_user: User = Depends(get_current_user)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        AppErrors.raise_error("refresh_token_missing")

    access_token, new_refresh_token = await refresh_access_token(
        refresh_token, current_user.id
    )
    set_auth_cookies(response, access_token, new_refresh_token)

    return {
        "status": "success",
        "result": current_user,
    }
