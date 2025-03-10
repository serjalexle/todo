from pydantic import BaseModel, EmailStr

from app.models.task import Task
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# DTO для створення задачі
class TaskCreateDTO(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "MIDDLE"
    status: str = "TODO"
    deadline: Optional[datetime] = None

# DTO для оновлення задачі
class TaskUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[datetime] = None

# DTO для отримання задачі
class TaskResponseDTO(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    deadline: Optional[datetime] = None
    updated_at: datetime
    created_at: datetime

# DTO для відповіді зі списком задач
class UserTasksResponse(BaseModel):
    status: str
    result: List[TaskResponseDTO]
