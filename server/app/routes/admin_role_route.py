from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.middleware.common import get_current_admin
from app.dto.roles import RoleCreateDTO, RoleUpdateDTO
from app.models.role import Role
from app.constants.constants import ALL_PERMISSIONS
from app.utils.permissions import check_permission

admin_role_router = APIRouter(
    prefix="/api/admin/roles",
    tags=["Admin Role Management"],
)


# ✅ Отримати список ролей
@admin_role_router.get("/", operation_id="admin get roles")
async def get_all_roles(
    current_admin=Depends(get_current_admin),
    page: int = Query(1, ge=1),
    count: int = Query(10, ge=1, le=100),
    sort_field: Optional[str] = Query("created_at"),
    sort_type: Optional[str] = Query("desc"),
    filter_name: Optional[str] = Query(None),
):
    """Отримати список усіх ролей (тільки для супер-адмінів)"""
    await check_permission(current_admin, ALL_PERMISSIONS["role_read"])

    print(
        f"GET ALL ROLES | page: {page}, count: {count}, sort: {sort_field} {sort_type}"
    )

    query_filter = {}

    if filter_name:
        query_filter["name"] = {"$regex": filter_name, "$options": "i"}

    sort_order = -1 if sort_type == "desc" else 1
    total_roles = await Role.find(query_filter).count()

    pipeline = [
        {"$match": query_filter},
        {"$sort": {sort_field: sort_order}},
        {"$skip": (page - 1) * count},
        {"$limit": count},
        {
            "$lookup": {
                "from": "admins",  # назва колекції з адмінами
                "localField": "created_by",
                "foreignField": "_id",
                "as": "created_by",
            }
        },
        {"$unwind": {"path": "$created_by", "preserveNullAndEmptyArrays": True}},
        {"$project": {"created_by.password": 0}},
    ]

    roles = await Role.aggregate(pipeline).to_list()
    meta = {"total": total_roles, "page": page, "count": len(roles)}

    return {"status": "success", "result": {"roles": roles, "meta": meta}}


# ✅ Отримати конкретну роль
@admin_role_router.get("/{role_id}", operation_id="admin get role by id")
async def get_role(role_id: str, current_admin=Depends(get_current_admin)):
    """Отримати дані про конкретну роль (тільки для супер-адмінів)"""
    await check_permission(current_admin, ALL_PERMISSIONS["role_read"])

    if not role_id:
        raise HTTPException(status_code=400, detail="Role ID is required")

    role = await Role.aggregate(
        [
            {"$match": {"_id": role_id}},
            {
                "$lookup": {
                    "from": "admins",
                    "localField": "created_by",
                    "foreignField": "_id",
                    "as": "created_by",
                }
            },
            {"$unwind": {"path": "$created_by", "preserveNullAndEmptyArrays": True}},
            {"$project": {"created_by.password": 0}},
        ]
    ).to_list()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return {"status": "success", "result": role}


# ✅ Створити нову роль
@admin_role_router.post(
    "/", status_code=status.HTTP_201_CREATED, operation_id="admin create role"
)
async def create_role(
    role_data: RoleCreateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін створює нову роль"""
    await check_permission(current_admin, ALL_PERMISSIONS["role_create"])

    existing_role = await Role.find_one({"name": role_data.name})
    if existing_role:
        raise HTTPException(
            status_code=400, detail="Role with this name already exists"
        )

    new_role = Role(
        name=role_data.name,
        permissions=role_data.permissions,
        created_by=current_admin.id,
    )
    await new_role.insert()

    return {"status": "success", "result": new_role.to_dict()}


# ✅ Оновити роль
@admin_role_router.patch("/{role_id}", operation_id="admin update role")
async def update_role(
    role_id: str, role_data: RoleUpdateDTO, current_admin=Depends(get_current_admin)
):
    """Супер-адмін оновлює дані ролі"""
    await check_permission(current_admin, ALL_PERMISSIONS["role_update"])

    role = await Role.find_one({"_id": role_id})
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    update_data = role_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(role, key, value)

    role.updated_at = datetime.now(timezone.utc)
    await role.save()

    return {"status": "success", "result": role.to_dict()}


# ✅ Видалити роль
@admin_role_router.delete(
    "/{role_id}", status_code=status.HTTP_200_OK, operation_id="admin delete role"
)
async def delete_role(role_id: str, current_admin=Depends(get_current_admin)):
    """Супер-адмін видаляє роль"""
    await check_permission(current_admin, ALL_PERMISSIONS["role_delete"])

    role = await Role.find_one({"_id": role_id})
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    await role.delete()

    return {"status": "success", "message": f"Role {role_id} deleted successfully."}
