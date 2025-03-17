from fastapi import HTTPException, status
from app.models.admin import Admin


def check_permission(admin: Admin, required_permission: str):
    """
    Перевіряє, чи є у адміністратора потрібний дозвіл.
    """
    if required_permission not in admin.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Недостатньо прав для доступу: {required_permission}",
        )
