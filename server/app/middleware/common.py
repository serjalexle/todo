from fastapi import Request

from app.common.errors import AppErrors
from app.models.user import User
from app.utils.common import verify_jwt


async def get_current_user(request: Request):
    try:
        # Перевіряємо спочатку Authorization Header (Bearer Token)
        auth_header = request.headers.get("Authorization")
        token = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]  # Витягуємо сам токен
        else:
            # Якщо в заголовку немає, пробуємо отримати токен з cookies
            token = request.cookies.get("access_token")

        if not token:
            AppErrors.raise_error("authentication_required")

        payload = verify_jwt(token)
        user_id = payload.get("user_id")

        if user_id is None:
            AppErrors.raise_error("authentication_required")

        user = await User.find_one({"_id": user_id})
        if user is None:
            AppErrors.raise_error("access_forbidden")

        return user
    except Exception as e:
        AppErrors.raise_error("authentication_required")
        return None
