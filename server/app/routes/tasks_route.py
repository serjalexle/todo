from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Response, status
from app.dto.tasks import (
    UserTasksResponse,
    TaskCreateDTO,
    TaskUpdateDTO,
    TaskResponseDTO,
)
from app.middleware.common import get_current_user
from app.models.task import Task
from app.models.user import User

tasks_router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)


# ✅ Отримати всі задачі користувача
@tasks_router.get("/", response_model=UserTasksResponse, operation_id="get_user_tasks")
async def get_user_tasks(current_user: User = Depends(get_current_user)):
    tasks = await Task.find({"user_id": current_user.id}).to_list()
    return {"status": "success", "result": tasks}


# ✅ Отримати конкретну задачу
@tasks_router.get("/{task_id}", response_model=TaskResponseDTO)
async def get_task(task_id: str, current_user: User = Depends(get_current_user)):
    task = await Task.find_one({"id": task_id, "user_id": current_user.id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ✅ Створити нову задачу
@tasks_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreateDTO, current_user: User = Depends(get_current_user)
):

    new_task = Task(
        creator_id=current_user.id,
        assigned_to=task_data.assigned_to or current_user.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        status=task_data.status,
        deadline=task_data.deadline,
    )
    await new_task.insert()
    return {
        "status": "success",
        "result": new_task,
    }


# ✅ Оновити задачу
@tasks_router.put("/{task_id}", response_model=TaskResponseDTO)
async def update_task(
    task_id: str,
    task_data: TaskUpdateDTO,
    current_user: User = Depends(get_current_user),
):
    task = await Task.find_one({"id": task_id, "user_id": current_user.id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.now(timezone.utc)
    await task.save()
    return task


# ✅ Видалити задачу
@tasks_router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    task = await Task.find_one({"id": task_id, "user_id": current_user.id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await task.delete()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
