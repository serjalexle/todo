# app/routes/login_history_route.py

from fastapi import APIRouter, Depends, Request
from typing import List

from app.middleware.common import get_current_user
from app.models.login_history import LoginHistory
from app.dto.login_history_dto import LoginHistoryOut

login_history_router = APIRouter(prefix="/api/history", tags=["Login History"])


@login_history_router.get("/logins", response_model=List[LoginHistoryOut])
async def get_login_history(request: Request, user=Depends(get_current_user)):
    logs = (
        await LoginHistory.find({"user_id": str(user.id)}).sort("-created_at").to_list()
    )
    return logs
