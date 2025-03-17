from fastapi import HTTPException, status
from app.models.admin import Admin
from app.models.role import Role


async def check_permission(admin: Admin, required_permission: str):
    """
    Перевіряє, чи є у адміністратора потрібний дозвіл.
    """

    admins_role = await Role.find_one({"_id": admin.role_id})
    if not admins_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Роль адміністратора не знайдена",
        )

    permissions = [
        *admins_role.permissions,
        *admin.custom_permissions,
    ]

    if required_permission not in permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Недостатньо прав для доступу: {required_permission}",
        )
