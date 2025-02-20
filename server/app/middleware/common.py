from fastapi import HTTPException, status, Request

from app.common.errors import AppErrors
from app.models.user import User
from app.utils.common import verify_jwt


async def get_current_user(request: Request):
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
