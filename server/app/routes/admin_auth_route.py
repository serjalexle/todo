# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.common.errors import AppErrors
from app.dto.auth import LoginDto
from app.middleware.common import get_current_admin
from app.models.admin import Admin
from app.models.login_history import LoginHistory
from app.models.token import RefreshToken
from app.models.user import User
from app.services.auth_service import (
    authenticate_admin,
    create_tokens,
    set_auth_cookies,
    clear_auth_cookies,
    refresh_access_token,
)
from app.utils.geo import get_geo_info

admin_auth_router = APIRouter(
    prefix="/api/admin/auth",
    tags=["Admin Auth"],
)


@admin_auth_router.post("/login", operation_id="admin login")
async def login(login_data: LoginDto, request: Request, response: Response):
    admin = await authenticate_admin(login_data.email, login_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password",
        )

    access_token, refresh_token = await create_tokens(admin.id)

    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "")
    country, city = await get_geo_info(ip_address)

    history = LoginHistory(
        user_id=str(admin.id),
        is_admin=True,
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
            "result": Admin.to_dict(admin, exclude_password=True),
        }
    else:
        # Повертаємо токени у JSON для мобільних клієнтів
        return {
            "status": "success",
            "result": Admin.to_dict(admin, exclude_password=True),
            "access_token": access_token,
            "refresh_token": refresh_token,
        }


@admin_auth_router.get("/logout", operation_id="admin logout")
async def logout(
    request: Request,
    response: Response,
    current_admin: Admin = Depends(get_current_admin),
):
    """Логаут користувача: видаляє рефреш-токен з БД і куки (якщо це веб)"""

    print("LOGOUT ROUTE IS CALLED")

    client_type = request.headers.get("client-type", "mobile").lower()

    deleted_tokens = await RefreshToken.find({"user_id": current_admin.id}).to_list()

    if deleted_tokens:
        await RefreshToken.find({"user_id": current_admin.id}).delete_many()

    if client_type == "web":
        clear_auth_cookies(response)
    return {
        "status": "success",
        "result": "Logged out successfully",
    }


@admin_auth_router.get("/refresh", operation_id="admin refresh token")
async def refresh(
    request: Request,
    response: Response,
    current_admin: Admin = Depends(get_current_admin),
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
        refresh_token, current_admin.id
    )

    if client_type == "web":
        # Оновлюємо cookies для веб-користувачів
        set_auth_cookies(response, access_token, new_refresh_token)
        return {
            "status": "success",
            "result": Admin.to_dict(current_admin, exclude_password=True),
        }
    else:
        # Повертаємо токени у JSON для мобільних клієнтів
        return {
            "status": "success",
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "result": Admin.to_dict(current_admin, exclude_password=True),
        }
