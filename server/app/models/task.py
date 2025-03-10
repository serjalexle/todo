from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import uuid4

from beanie import Document, before_event
from pydantic import Field


class TaskPriority(str, Enum):
    LOW = "LOW"
    MIDDLE = "MIDDLE"
    HIGH = "HIGH"


class TaskStatus(str, Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    CANCELED = "CANCELED"
    BLOCKED = "BLOCKED"  # Додатковий статус, якщо задача заблокована


class Task(Document):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    creator_id: str  # ID користувача, який створив задачу
    assigned_to: Optional[str] = None  # Виконавець задачі (за замовчуванням = creator_id)
    title: str = Field(..., min_length=3, max_length=255)  # Назва задачі
    description: Optional[str] = None  # Опис задачі
    priority: TaskPriority = TaskPriority.MIDDLE  # Пріоритет
    status: TaskStatus = TaskStatus.TODO  # Статус виконання
    deadline: Optional[datetime] = None  # Крайній термін виконання
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Час останнього оновлення
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Час створення

    class Settings:
        name = "tasks"
        indexes = ["creator_id", "assigned_to", "priority", "status", "deadline", "_id"]

    @before_event("INSERT")
    async def set_assigned_to_on_insert(self):
        """Якщо `assigned_to` не вказано, встановлюємо його як `creator_id`"""
        if not self.assigned_to:
            self.assigned_to = self.creator_id

    @before_event("UPDATE")
    async def update_timestamp_on_update(self):
        """Оновлює `updated_at` перед оновленням документа"""
        self.updated_at = datetime.now(timezone.utc)
