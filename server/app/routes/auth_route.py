# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.common.errors import AppErrors
from app.dto.auth import LoginDto, RefreshResponse, RegisterDto
from app.middleware.common import get_current_user
from app.models.login_history import LoginHistory
from app.models.token import RefreshToken
from app.models.user import User
from app.services.auth_service import (
    authenticate_user,
    create_tokens,
    set_auth_cookies,
    clear_auth_cookies,
    refresh_access_token,
)
from app.utils.common import hash_password
from app.utils.geo import get_geo_info

auth_router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"],
)


@auth_router.post("/login", operation_id="user login")
async def login(login_data: LoginDto, request: Request, response: Response):
    print("LOGIN ROUTE IS CALLED")

    user = await authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password",
        )

    access_token, refresh_token = await create_tokens(user.id)
    print(f"Access token: {access_token}")
    print(f"Refresh token: {refresh_token}")
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "")
    country, city = await get_geo_info(ip_address)

    history = LoginHistory(
        user_id=str(user.id),
        is_admin=False,
        ip_address=ip_address,
        country=country,
        city=city,
        user_agent=user_agent
    )
    await history.insert()

    # Визначаємо, чи це мобільний додаток чи веб
    client_type = request.headers.get("client-type", "mobile").lower()

    if client_type == "web":
        # Встановлюємо cookies для веб-клієнтів
        set_auth_cookies(response, access_token, refresh_token)
        return {
            "status": "success",
            "result": User.to_dict(user, exclude_password=True),
        }
    else:
        # Повертаємо токени у JSON для мобільних клієнтів
        return {
            "status": "success",
            "result": User.to_dict(user, exclude_password=True),
            "access_token": access_token,
            "refresh_token": refresh_token,
        }


@auth_router.post("/register", operation_id="user register")
async def register(register_data: RegisterDto, response: Response, request: Request):
    print("REGISTER ROUTE IS CALLED")
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

    access_token, refresh_token = await create_tokens(created_user.id)

    # Перевіряємо тип клієнта (Web або Mobile)
    client_type = request.headers.get("client-type", "mobile").lower()

    if client_type == "web":
        # Ставимо куки для веб-додатку
        set_auth_cookies(response, access_token, refresh_token)
        return {
            "status": "success",
            "result": User.to_dict(created_user, exclude_password=True),
        }
    else:
        # Повертаємо токени в тілі відповіді для мобільних клієнтів
        return {
            "status": "success",
            "result": User.to_dict(created_user, exclude_password=True),
            "access_token": access_token,
            "refresh_token": refresh_token,
        }


@auth_router.get("/logout", operation_id="user logout")
async def logout(
    request: Request, response: Response, current_user: User = Depends(get_current_user)
):
    """Логаут користувача: видаляє рефреш-токен з БД і куки (якщо це веб)"""

    print("LOGOUT ROUTE IS CALLED")

    client_type = request.headers.get("client-type", "mobile").lower()

    access_token_with_bearer = request.headers.get("Authorization")
    access_token = (
        access_token_with_bearer.split(" ")[1] if access_token_with_bearer else None
    )

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is required",
        )

    deleted_tokens = await RefreshToken.find({"user_id": current_user.id}).to_list()

    if deleted_tokens:
        await RefreshToken.find({"user_id": current_user.id}).delete_many()

    if client_type == "web":
        clear_auth_cookies(response)
    return {
        "status": "success",
        "result": "Logged out successfully",
    }


@auth_router.get(
    "/refresh",
    # response_model=RefreshResponse,
    operation_id="user refresh",
)
async def refresh(
    request: Request, response: Response, current_user: User = Depends(get_current_user)
):
    print("REFRESH ROUTE IS CALLED")

    # Визначаємо тип клієнта
    client_type = request.headers.get("client-type", "mobile").lower()

    # Отримуємо refresh_token (не перевіряємо його тут, бо це вже робить get_current_user)
    refresh_token = (
        request.cookies.get("refresh_token") if client_type == "web" else None
    )
    auth_header = request.headers.get("Authorization")

    if client_type == "mobile" and auth_header and auth_header.startswith("Bearer "):
        refresh_token = auth_header.split(" ")[1]

    if not refresh_token:
        AppErrors.raise_error("refresh_token_missing")

    # Генеруємо нові токени
    access_token, new_refresh_token = await refresh_access_token(
        refresh_token, current_user.id
    )

    if client_type == "web":
        # Оновлюємо cookies для веб-користувачів
        set_auth_cookies(response, access_token, new_refresh_token)
        return {
            "status": "success",
            "result": User.to_dict(current_user, exclude_password=True),
        }
    else:
        # Повертаємо токени у JSON для мобільних клієнтів
        return {
            "status": "success",
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "result": User.to_dict(current_user, exclude_password=True),
        }
