from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.middleware.common import get_current_admin
from app.dto.admins import AdminCreateDTO, AdminUpdateDTO
from app.models.admin import Admin

admin_admin_router = APIRouter(
    prefix="/api/admin/admins",
    tags=["Admin Admin Management"],
)


# ✅ Отримати список адмінів
@admin_admin_router.get("/", operation_id="get_all_admins")
async def get_all_admins(
    current_admin=Depends(get_current_admin),
    page: int = Query(1, ge=1),
    count: int = Query(10, ge=1, le=100),
    sort_field: Optional[str] = Query("created_at"),
    sort_type: Optional[str] = Query("desc"),
    filter_email: Optional[str] = Query(None),
    filter_role: Optional[str] = Query(None),
):
    """Отримати список усіх адміністраторів (тільки для супер-адмінів)"""

    print(
        f"GET ALL ADMINS | page: {page}, count: {count}, sort: {sort_field} {sort_type}"
    )

    query_filter = {}

    if filter_email:
        query_filter["email"] = {"$regex": filter_email, "$options": "i"}
    if filter_role:
        query_filter["role"] = filter_role

    sort_order = -1 if sort_type == "desc" else 1
    total_admins = await Admin.find(query_filter).count()

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

    admins = await Admin.aggregate(pipeline).to_list()
    meta = {"total": total_admins, "page": page, "count": len(admins)}

    return {"status": "success", "result": {"admins": admins, "meta": meta}}


# ✅ Отримати конкретного адміна
@admin_admin_router.get("/{admin_id}")
async def get_admin(admin_id: str, current_admin=Depends(get_current_admin)):
    """Отримати дані про конкретного адміністратора (тільки для супер-адмінів)"""

    if not admin_id:
        raise HTTPException(status_code=400, detail="Admin ID is required")

    admin = await Admin.find_one({"_id": admin_id}, projection={"password": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    return {"status": "success", "result": admin}


# ✅ Створити нового адміністратора
@admin_admin_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін створює нового адміністратора"""

    existing_admin = await Admin.find_one({"email": admin_data.email})
    if existing_admin:
        raise HTTPException(
            status_code=400, detail="Admin with this email already exists"
        )

    new_admin = Admin(
        email=admin_data.email,
        password=admin_data.password,  # Пароль має хешуватися перед збереженням!
        role=admin_data.role,
        permissions=admin_data.permissions,
    )
    await new_admin.insert()

    return {"status": "success", "result": new_admin.to_dict(exclude_password=True)}


# ✅ Оновити адміністратора
@admin_admin_router.patch("/{admin_id}")
async def update_admin(
    admin_id: str, admin_data: AdminUpdateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін оновлює дані адміністратора"""

    admin = await Admin.find_one({"_id": admin_id})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    update_data = admin_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(admin, key, value)

    admin.updated_at = datetime.now(timezone.utc)
    await admin.save()

    return {"status": "success", "result": admin.to_dict(exclude_password=True)}


# ✅ Видалити адміністратора
@admin_admin_router.delete("/{admin_id}", status_code=status.HTTP_200_OK)
async def delete_admin(admin_id: str, current_admin=Depends(get_current_admin)):
    """Супер-адмін видаляє адміністратора"""

    admin = await Admin.find_one({"_id": admin_id})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if admin.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot delete superadmin")

    await admin.delete()

    return {"status": "success", "message": f"Admin {admin_id} deleted successfully."}
