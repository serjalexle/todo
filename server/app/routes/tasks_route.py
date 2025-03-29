from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.dto.tasks import (
    TaskCreateDTO,
    TaskUpdateDTO,
)
from app.middleware.common import get_current_user
from app.models.task import Task
from app.models.user import User
from typing import Optional

tasks_router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)


# ✅ Отримати всі задачі користувача
@tasks_router.get("", operation_id="get_user_tasks")
async def get_user_tasks(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, alias="page", ge=1),
    count: int = Query(10, alias="count", ge=1, le=100),
    sort_field: Optional[str] = Query("created_at", alias="sort[field]"),
    sort_type: Optional[str] = Query("desc", alias="sort[type]"),
    filter_title: Optional[str] = Query(None, alias="filter[title]"),
    filter_status: Optional[str] = Query(None, alias="filter[status]"),
    role: Optional[str] = Query("all", alias="role", regex="^(all|created|assigned)$"),
):
    """Отримати список задач, де користувач є або творцем (`created`), або виконавцем (`assigned`)"""

    print(
        f"GET USER TASKS | page: {page}, count: {count}, sort: {sort_field} {sort_type}, role: {role}"
    )

    # Формуємо базовий фільтр
    if role == "created":
        query_filter = {"creator_id": current_user.id}
    elif role == "assigned":
        query_filter = {"assigned_to": current_user.id}
    else:  # role == "all"
        query_filter = {
            "$or": [{"creator_id": current_user.id}, {"assigned_to": current_user.id}]
        }

    # Додаємо фільтрацію
    if filter_title:
        query_filter["title"] = {
            "$regex": filter_title,
            "$options": "i",
        }  # Пошук без регістру
    if filter_status:
        query_filter["status"] = filter_status  # Фільтр по статусу

    # Визначаємо порядок сортування
    sort_order = -1 if sort_type == "desc" else 1

    # Отримуємо загальну кількість задач (для `total`)
    total_tasks = await Task.find(query_filter).count()

    # Використовуємо `aggregate`, щоб підтягнути `creator` та `assigned_user`
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
        {"$sort": {sort_field: sort_order}},  # Додаємо сортування
        {"$skip": (page - 1) * count},  # Пагінація
        {"$limit": count},
        {
            "$project": {  # Видаляємо зайві поля
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]

    tasks = await Task.aggregate(pipeline).to_list()

    # Формуємо `meta`
    meta = {"total": total_tasks, "page": page, "count": len(tasks)}

    return {"status": "success", "result": {"tasks": tasks, "meta": meta}}


@tasks_router.get("/{task_id}", operation_id="get_task_user")
async def get_task(task_id: str, current_user: User = Depends(get_current_user)):
    """Отримання конкретної задачі з деталізацією користувачів"""
    print("GET TASK ROUTE IS CALLED", task_id)

    if not task_id:
        raise HTTPException(status_code=400, detail="Task ID is required")

    pipeline = [
        {
            "$match": {"_id": task_id, "creator_id": current_user.id}
        },  # Фільтр за task_id та creator_id
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
            "$project": {  # Видаляємо паролі та зайві поля
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]

    enriched_task = await Task.aggregate(pipeline).to_list(length=1)
    print(enriched_task)

    if not enriched_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"status": "success", "result": enriched_task[0]}


# ✅ Створити нову задачу
@tasks_router.post(
    "", status_code=status.HTTP_201_CREATED, operation_id="create_task_user"
)
async def create_task(
    task_data: TaskCreateDTO, current_user: User = Depends(get_current_user)
):
    print("CREATE TASK ROUTE IS CALLED", task_data)
    # 🔒 Валідація: або інтервал, або дні тижня, не обидва
    # 🔁 Додано для регулярних задач
    if task_data.recurrence_weekdays and (
        task_data.recurrence_interval or task_data.recurrence_unit
    ):
        raise HTTPException(
            status_code=400,
            detail="Choose either recurrence_interval+unit or recurrence_weekdays, not both.",
        )

    new_task = Task(
        creator_id=current_user.id,
        assigned_to=task_data.assigned_to or current_user.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        status=task_data.status,
        deadline=task_data.deadline,
        # 🔁 Додано для регулярних задач
        is_recurring=task_data.is_recurring or False,
        recurrence_interval=task_data.recurrence_interval,
        recurrence_unit=task_data.recurrence_unit,
        recurrence_weekdays=task_data.recurrence_weekdays,
        last_recurrence=None,  # Перший запуск ще не відбувся
    )
    await new_task.insert()

    # Виконуємо aggregation, щоб одразу отримати повну інформацію про creator та assigned_to
    pipeline = [
        {"$match": {"_id": new_task.id}},
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
            "$project": {  # Видаляємо паролі та зайві поля
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]
    enriched_task = await Task.aggregate(pipeline).to_list(length=1)
    if not enriched_task:
        raise HTTPException(status_code=404, detail="Task not found after creation")
    return {
        "status": "success",
        "result": enriched_task[0],
    }


# ✅ Оновити задачу
@tasks_router.patch("/{task_id}", operation_id="update_task_user")
async def update_task(
    task_id: str,
    task_data: TaskUpdateDTO,
    current_user: User = Depends(get_current_user),
):
    """Оновлення задачі (тільки якщо юзер є творцем або виконавцем)"""

    print(f"UPDATE TASK ROUTE CALLED | task_id: {task_id}")

    # Перевіряємо, що юзер має право оновлювати цю задачу
    task = await Task.find_one(
        {
            "_id": task_id,
            "$or": [{"creator_id": current_user.id}, {"assigned_to": current_user.id}],
        }
    )

    if not task:
        raise HTTPException(
            status_code=404, detail="Task not found or no permission to update"
        )

    # Оновлюємо тільки передані поля
    update_data = task_data.model_dump(exclude_unset=True)

    # 🔁 Додано для регулярних задач — перевірка, щоб не було одночасно інтервалу і днів тижня
    recurrence_fields = {
        "is_recurring",
        "recurrence_interval",
        "recurrence_unit",
        "recurrence_weekdays",
    }
    if recurrence_fields.intersection(update_data.keys()):
        interval_set = update_data.get("recurrence_interval") or update_data.get(
            "recurrence_unit"
        )
        weekdays_set = update_data.get("recurrence_weekdays")

        if interval_set and weekdays_set:
            raise HTTPException(
                status_code=400,
                detail="Choose either recurrence_interval+unit or recurrence_weekdays, not both.",
            )

    # 🔁 Якщо задача є копією — оновлюємо оригінал для всіх важливих логічних полів
    if task.original_task_id:
        original_task = await Task.find_one({"_id": task.original_task_id})
        if not original_task:
            raise HTTPException(
                status_code=404, detail="Original recurring task not found"
            )

        if (
            original_task.creator_id != current_user.id
            and original_task.assigned_to != current_user.id
        ):
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to update the original recurring task",
            )

        # Поля, які треба оновлювати в оригіналі
        fields_to_sync_with_original = {
            "title",
            "description",
            "priority",
            "deadline",
            "is_recurring",
            "recurrence_interval",
            "recurrence_unit",
            "recurrence_weekdays",
        }

        for key in fields_to_sync_with_original:
            if key in update_data:
                setattr(original_task, key, update_data[key])

        original_task.updated_at = datetime.now(timezone.utc)
        await original_task.save()

    # 🔄 Звичайне оновлення самої задачі (наприклад, статус, коментарі, виконання)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    await task.save()

    # Використовуємо `aggregate`, щоб підтягнути `creator` та `assigned_user`
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
            "$project": {  # Видаляємо паролі та зайві ID
                "creator.password": 0,
                "assigned_user.password": 0,
                "creator_id": 0,
                "assigned_to": 0,
            }
        },
    ]

    updated_task = await Task.aggregate(pipeline).to_list(length=1)
    if not updated_task:
        raise HTTPException(
            status_code=404, detail="Task updated but could not be retrieved"
        )

    return {"status": "success", "result": updated_task[0]}


# ✅ Видалити задачу
@tasks_router.delete(
    "/{task_id}", status_code=status.HTTP_200_OK, operation_id="delete_task_user"
)
async def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    """Видалення конкретної задачі, якщо вона належить поточному користувачу"""

    print(f"DELETE TASK ROUTE IS CALLED with task_id: {task_id}")

    # Переконуємось, що задача існує та належить поточному користувачу
    task = await Task.find_one({"_id": task_id, "creator_id": current_user.id})
    print(f"Found task to delete: {task}")

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Видаляємо задачу
    await task.delete()
    print(f"Task {task_id} deleted successfully.")

    return {"status": "success", "message": f"Task {task_id} deleted successfully."}
