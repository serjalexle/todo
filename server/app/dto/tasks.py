from pydantic import BaseModel, EmailStr

from app.models.task import Task
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# DTO для створення задачі
class TaskCreateDTO(BaseModel):
    title: str  # Назва задачі
    description: Optional[str] = None  # Опис
    priority: str = "MIDDLE"  # Пріоритет (LOW, MIDDLE, HIGH, URGENT)
    status: str = "TODO"  # Статус задачі
    deadline: Optional[datetime] = None  # Дедлайн
    assigned_to: Optional[str] = None  # Кому призначено

    # --- Поля для регулярних задач ---
    is_recurring: Optional[bool] = False  # Чи задача є регулярною
    recurrence_interval: Optional[int] = None  # Інтервал (наприклад, кожні 2 дні)
    recurrence_unit: Optional[str] = None  # Одиниця інтервалу ("DAY" або "WEEK")
    recurrence_weekdays: Optional[List[int]] = None  # Список днів тижня (0 — понеділок, 6 — неділя)
 

# DTO для оновлення задачі
class TaskUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[datetime] = None

    # --- Поля для оновлення регулярності ---
    is_recurring: Optional[bool] = None
    recurrence_interval: Optional[int] = None
    recurrence_unit: Optional[str] = None
    recurrence_weekdays: Optional[List[int]] = None


# DTO для отримання задачі
class TaskResponseDTO(BaseModel):
    id: str
    creator_id: str
    assigned_to: Optional[str] = None
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    deadline: Optional[datetime] = None
    updated_at: datetime
    created_at: datetime

    # --- Регулярність ---
    is_recurring: bool
    recurrence_interval: Optional[int] = None
    recurrence_unit: Optional[str] = None
    recurrence_weekdays: Optional[List[int]] = None
    last_recurrence: Optional[datetime] = None
    original_task_id: Optional[str] = None


# DTO для відповіді зі списком задач
class UserTasksResponse(BaseModel):
    status: str
    result: List[TaskResponseDTO]

