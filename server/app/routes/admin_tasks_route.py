from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.middleware.common import get_current_admin
from app.dto.tasks import TaskCreateDTO, TaskUpdateDTO
from app.models.task import Task
from app.models.user import User
from app.constants.constants import ALL_PERMISSIONS
from app.utils.permissions import check_permission

admin_tasks_router = APIRouter(
    prefix="/api/admin/tasks",
    tags=["Admin Tasks Management"],
)


# ✅ Отримати всі задачі в системі
@admin_tasks_router.get("/", operation_id="get_all_tasks")
async def get_all_tasks(
    current_admin=Depends(get_current_admin),
    page: int = Query(1, ge=1),
    count: int = Query(10, ge=1, le=100),
    sort_field: Optional[str] = Query("created_at"),
    sort_type: Optional[str] = Query("desc"),
    filter_title: Optional[str] = Query(None),
    filter_status: Optional[str] = Query(None),
):
    """Отримати всі задачі в системі (тільки для адмінів)"""
    check_permission(current_admin, ALL_PERMISSIONS["task_read"])


    print(
        f"GET ALL TASKS | page: {page}, count: {count}, sort: {sort_field} {sort_type}"
    )

    query_filter = {}

    if filter_title:
        query_filter["title"] = {"$regex": filter_title, "$options": "i"}
    if filter_status:
        query_filter["status"] = filter_status

    sort_order = -1 if sort_type == "desc" else 1
    total_tasks = await Task.find(query_filter).count()

    pipeline = [
        {"$match": query_filter},
        {
            "$lookup": {
                "from": "users",
                "localField": "creator_id",
                "foreignField": "_id",
                "as": "creator",
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "assigned_to",
                "foreignField": "_id",
                "as": "assigned_user",
            }
        },
        {"$unwind": {"path": "$creator", "preserveNullAndEmptyArrays": True}},
        {"$unwind": {"path": "$assigned_user", "preserveNullAndEmptyArrays": True}},
        {"$sort": {sort_field: sort_order}},
        {"$skip": (page - 1) * count},
        {"$limit": count},
        {
            "$project": {
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]

    tasks = await Task.aggregate(pipeline).to_list()
    meta = {"total": total_tasks, "page": page, "count": len(tasks)}

    return {"status": "success", "result": {"tasks": tasks, "meta": meta}}


# ✅ Отримати конкретну задачу
@admin_tasks_router.get("/{task_id}")
async def get_task_admin(task_id: str, current_admin=Depends(get_current_admin)):
    """Отримати будь-яку задачу (тільки для адмінів)"""
    check_permission(current_admin, ALL_PERMISSIONS["task_read"])

    if not task_id:
        raise HTTPException(status_code=400, detail="Task ID is required")

    pipeline = [
        {"$match": {"_id": task_id}},
        {
            "$lookup": {
                "from": "users",
                "localField": "creator_id",
                "foreignField": "_id",
                "as": "creator",
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "assigned_to",
                "foreignField": "_id",
                "as": "assigned_user",
            }
        },
        {"$unwind": {"path": "$creator", "preserveNullAndEmptyArrays": True}},
        {"$unwind": {"path": "$assigned_user", "preserveNullAndEmptyArrays": True}},
        {
            "$project": {
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]

    enriched_task = await Task.aggregate(pipeline).to_list(length=1)

    if not enriched_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"status": "success", "result": enriched_task[0]}


# ✅ Створити задачу для будь-якого користувача
@admin_tasks_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task_admin(
    task_data: TaskCreateDTO, current_admin=Depends(get_current_admin)
):
    """Адміністратор створює задачу для будь-якого користувача"""
    check_permission(current_admin, ALL_PERMISSIONS["task_create"])

    if not task_data.assigned_to:
        raise HTTPException(status_code=400, detail="Assigned user is required")

    new_task = Task(
        creator_id=current_admin.id,
        assigned_to=task_data.assigned_to,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        status=task_data.status,
        deadline=task_data.deadline,
    )
    await new_task.insert()

    return {"status": "success", "result": new_task}


# ✅ Оновити будь-яку задачу
@admin_tasks_router.patch("/{task_id}")
async def update_task_admin(
    task_id: str, task_data: TaskUpdateDTO, current_admin=Depends(get_current_admin)
):
    """Адмін оновлює будь-яку задачу"""
    check_permission(current_admin, ALL_PERMISSIONS["task_update"])

    task = await Task.find_one({"_id": task_id})

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    await task.save()

    return {"status": "success", "result": task}


# ✅ Видалити будь-яку задачу
@admin_tasks_router.delete("/{task_id}", status_code=status.HTTP_200_OK)
async def delete_task_admin(task_id: str, current_admin=Depends(get_current_admin)):
    """Адмін видаляє будь-яку задачу"""
    check_permission(current_admin, ALL_PERMISSIONS["task_delete"])

    task = await Task.find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await task.delete()

    return {"status": "success", "message": f"Task {task_id} deleted successfully."}
