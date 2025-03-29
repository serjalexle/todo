from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.middleware.common import get_current_admin
from app.dto.users import UserCreateDTO, UserUpdateDTO
from app.models.user import User
from app.constants.constants import ALL_PERMISSIONS
from app.utils.permissions import check_permission
from app.utils.common import hash_password


admin_user_router = APIRouter(
    prefix="/api/admin/users",
    tags=["Admin User Management"],
)


# ✅ Отримати список користувачів
@admin_user_router.get("/", operation_id="admin get users")
async def get_all_users(
    current_admin=Depends(get_current_admin),
    page: int = Query(1, ge=1),
    count: int = Query(10, ge=1, le=100),
    sort_field: Optional[str] = Query("created_at"),
    sort_type: Optional[str] = Query("desc"),
    filter_email: Optional[str] = Query(None),
):
    """Отримати список усіх користувачів (тільки для адмінів)"""
    await check_permission(current_admin, ALL_PERMISSIONS["user_read"])

    print(
        f"GET ALL USERS | page: {page}, count: {count}, sort: {sort_field} {sort_type}"
    )

    query_filter = {}

    if filter_email:
        query_filter["email"] = {"$regex": filter_email, "$options": "i"}

    sort_order = -1 if sort_type == "desc" else 1
    total_users = await User.find(query_filter).count()

    pipeline = [
        {"$match": query_filter},
        {"$sort": {sort_field: sort_order}},
        {"$skip": (page - 1) * count},
        {"$limit": count},
        {
            "$project": {
                "password": 0,  # Видаляємо паролі
            }
        },
    ]

    users = await User.aggregate(pipeline).to_list()
    meta = {"total": total_users, "page": page, "count": len(users)}

    return {"status": "success", "result": {"users": users, "meta": meta}}


# ✅ Отримати конкретного користувача
@admin_user_router.get("/{user_id}", operation_id="admin get user")
async def get_user(user_id: str, current_admin=Depends(get_current_admin)):
    """Отримати дані про конкретного користувача (тільки для адмінів)"""
    await check_permission(current_admin, ALL_PERMISSIONS["user_read"])

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    user = await User.find_one({"_id": user_id})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user = user.to_dict(exclude_password=True)

    return {"status": "success", "result": user}


# ✅ Створити нового користувача
@admin_user_router.post(
    "/", status_code=status.HTTP_201_CREATED, operation_id="admin create user"
)
async def create_user(
    user_data: UserCreateDTO, current_admin=Depends(get_current_admin)
):
    """Адміністратор створює нового користувача"""
    await check_permission(current_admin, ALL_PERMISSIONS["user_create"])

    existing_user = await User.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=400, detail="User with this email already exists"
        )

    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password=hashed_password)
    await User.insert_one(new_user)

    new_user = new_user.to_dict(exclude_password=True)

    return {"status": "success", "result": new_user}


# ✅ Оновити користувача
@admin_user_router.patch("/{user_id}", operation_id="admin update user")
async def update_user(
    user_id: str, user_data: UserUpdateDTO, current_admin=Depends(get_current_admin)
):
    """Адмін оновлює дані користувача"""
    await check_permission(current_admin, ALL_PERMISSIONS["user_update"])

    user = await User.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    user.updated_at = datetime.now(timezone.utc)
    await user.save()

    return {"status": "success", "result": user.to_dict(exclude_password=True)}


# ✅ Видалити користувача
@admin_user_router.delete(
    "/{user_id}", status_code=status.HTTP_200_OK, operation_id="admin delete user"
)
async def delete_user(user_id: str, current_admin=Depends(get_current_admin)):
    """Адміністратор видаляє користувача"""
    await check_permission(current_admin, ALL_PERMISSIONS["user_delete"])
    user = await User.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await user.delete()

    return {"status": "success", "message": f"User {user_id} deleted successfully."}
