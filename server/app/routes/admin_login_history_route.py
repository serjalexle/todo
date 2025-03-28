# app/routes/admin_login_history_route.py

from fastapi import APIRouter, Depends, Query
from typing import List

from app.middleware.common import get_current_admin
from app.models.login_history import LoginHistory
from app.dto.login_history_dto import LoginHistoryOut

admin_login_history_router = APIRouter(
    prefix="/api/admin/history", tags=["Admin Login History"]
)


@admin_login_history_router.get("/logins", response_model=List[LoginHistoryOut])
async def get_admin_login_history(admin=Depends(get_current_admin)):
    logs = (
        await LoginHistory.find({"user_id": str(admin.id)})
        .sort("-created_at")
        .to_list()
    )
    return logs


@admin_login_history_router.get("/logins/by-user", response_model=List[LoginHistoryOut])
async def get_user_login_history(
    user_id: str = Query(..., description="ID користувача для перегляду логінів"),
    admin=Depends(get_current_admin),
):
    logs = await LoginHistory.find({"user_id": user_id}).sort("-created_at").to_list()
    return logs
