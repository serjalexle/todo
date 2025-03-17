from app.models.role import Role
from fastapi import HTTPException, status


async def validate_role(role_id: str):
    """Перевіряє, чи існує роль за ID"""
    role = await Role.find_one({"_id": role_id})
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вказана роль не існує",
        )
    return role
