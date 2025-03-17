from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.middleware.common import get_current_admin
from app.dto.admins import AdminCreateDTO, AdminUpdateDTO
from app.models.admin import Admin
from app.constants.constants import ALL_PERMISSIONS
from app.utils.permissions import check_permission
from app.utils.roles import validate_role

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
    filter_role: Optional[str] = Query(None),  # 🔥 Фільтр по назві ролі
):
    """Отримати список усіх адміністраторів (тільки для супер-адмінів)"""
    check_permission(current_admin, ALL_PERMISSIONS["admin_read"])

    print(
        f"GET ALL ADMINS | page: {page}, count: {count}, sort: {sort_field} {sort_type}"
    )

    query_filter = {}

    if filter_email:
        query_filter["email"] = {"$regex": filter_email, "$options": "i"}

    sort_order = -1 if sort_type == "desc" else 1

    # 🔥 Підключаємо `lookup`, щоб отримати повну інформацію про роль
    pipeline = [
        {"$match": query_filter},
        {
            "$lookup": {
                "from": "roles",  # Таблиця ролей
                "localField": "role_id",
                "foreignField": "_id",
                "as": "role",
            }
        },
        {
            "$unwind": {"path": "$role", "preserveNullAndEmptyArrays": True}
        },  # Якщо ролі немає – не помилка
        {"$sort": {sort_field: sort_order}},  # Сортування
        {"$skip": (page - 1) * count},  # Пагінація
        {"$limit": count},
        {
            "$project": {
                "password": 0,  # Видаляємо паролі
                "role_id": 0,  # Видаляємо `role_id`, бо тепер є повний `role`
            }
        },
    ]

    # 🔥 Додаємо фільтр по назві ролі (якщо є)
    if filter_role:
        pipeline.insert(1, {"$match": {"role.name": filter_role}})

    admins = await Admin.aggregate(pipeline).to_list()
    total_admins = await Admin.find(query_filter).count()

    meta = {"total": total_admins, "page": page, "count": len(admins)}

    return {"status": "success", "result": {"admins": admins, "meta": meta}}


# ✅ Отримати конкретного адміна
@admin_admin_router.get("/{admin_id}")
async def get_admin(admin_id: str, current_admin=Depends(get_current_admin)):
    """Отримати дані про конкретного адміністратора (тільки для супер-адмінів)"""
    check_permission(current_admin, ALL_PERMISSIONS["admin_read"])

    if not admin_id:
        raise HTTPException(status_code=400, detail="Admin ID is required")

    # 🔥 Використовуємо `lookup`, щоб отримати повну інформацію про роль
    pipeline = [
        {"$match": {"_id": admin_id}},
        {
            "$lookup": {
                "from": "roles",  # Таблиця ролей
                "localField": "role_id",
                "foreignField": "_id",
                "as": "role",
            }
        },
        {
            "$unwind": {"path": "$role", "preserveNullAndEmptyArrays": True}
        },  # Якщо ролі немає – не помилка
        {
            "$project": {
                "password": 0,  # 🔥 Видаляємо пароль
                "role_id": 0,  # 🔥 Видаляємо `role_id`, бо тепер є повний `role`
            }
        },
    ]

    enriched_admin = await Admin.aggregate(pipeline).to_list(length=1)

    if not enriched_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    return {"status": "success", "result": enriched_admin[0]}


# ✅ Створити нового адміністратора
@admin_admin_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін створює нового адміністратора"""

    check_permission(current_admin, ALL_PERMISSIONS["admin_create"])

    existing_admin = await Admin.find_one({"email": admin_data.email})
    if existing_admin:
        raise HTTPException(
            status_code=400, detail="Admin with this email already exists"
        )

    # 🔥 Перевіряємо, чи існує така роль
    role = await validate_role(admin_data.role_id)

    new_admin = Admin(
        email=admin_data.email,
        password=admin_data.password,  # Пароль має хешуватися перед збереженням!
        role_id=role.id,
        permissions=admin_data.permissions,
    )
    await new_admin.insert()
    # 🔥 Використовуємо `lookup`, щоб отримати повну інформацію про роль
    pipeline = [
        {"$match": {"_id": new_admin.id}},
        {
            "$lookup": {
                "from": "roles",  # 🔥 Таблиця ролей
                "localField": "role_id",
                "foreignField": "_id",
                "as": "role",
            }
        },
        {
            "$unwind": {"path": "$role", "preserveNullAndEmptyArrays": True}
        },  # Якщо ролі немає – не помилка
        {
            "$project": {
                "password": 0,  # 🔥 Видаляємо пароль
                "role_id": 0,  # 🔥 Видаляємо ID ролі
            }
        },
    ]

    enriched_admin = await Admin.aggregate(pipeline).to_list(length=1)

    if not enriched_admin:
        raise HTTPException(status_code=404, detail="Admin created but not found in DB")

    return {"status": "success", "result": enriched_admin[0]}


# ✅ Оновити адміністратора
@admin_admin_router.patch("/{admin_id}")
async def update_admin(
    admin_id: str, admin_data: AdminUpdateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін оновлює дані адміністратора"""

    check_permission(current_admin, ALL_PERMISSIONS["admin_update"])

    admin = await Admin.find_one({"_id": admin_id})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    update_data = admin_data.model_dump(exclude_unset=True)

    # 🔥 Якщо змінюється роль, перевіряємо її
    if "role_id" in update_data:
        role = await validate_role(update_data["role_id"])
        admin.role_id = role.id
        admin.permissions = role.permissions  # 🔥 Автоматично оновлюємо права

    for key, value in update_data.items():
        setattr(admin, key, value)

    admin.updated_at = datetime.now(timezone.utc)
    await admin.save()

    # 🔥 Використовуємо `lookup`, щоб підтягнути повну інформацію про роль
    pipeline = [
        {"$match": {"_id": admin.id}},
        {
            "$lookup": {
                "from": "roles",  # 🔥 Таблиця ролей
                "localField": "role_id",
                "foreignField": "_id",
                "as": "role",
            }
        },
        {
            "$unwind": {"path": "$role", "preserveNullAndEmptyArrays": True}
        },  # Якщо ролі немає – не помилка
        {
            "$project": {
                "password": 0,  # 🔥 Видаляємо пароль
                "role_id": 0,  # 🔥 Видаляємо ID ролі
            }
        },
    ]

    enriched_admin = await Admin.aggregate(pipeline).to_list(length=1)

    if not enriched_admin:
        raise HTTPException(status_code=404, detail="Admin updated but not found in DB")

    return {"status": "success", "result": enriched_admin[0]}


# ✅ Видалити адміністратора
@admin_admin_router.delete("/{admin_id}", status_code=status.HTTP_200_OK)
async def delete_admin(admin_id: str, current_admin=Depends(get_current_admin)):
    """Супер-адмін видаляє адміністратора"""

    check_permission(current_admin, ALL_PERMISSIONS["admin_delete"])

    admin = await Admin.find_one({"_id": admin_id})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if admin.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot delete superadmin")

    await admin.delete()

    return {"status": "success", "message": f"Admin {admin_id} deleted successfully."}
