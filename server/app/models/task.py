from datetime import datetime, timezone
from enum import Enum, IntEnum
from typing import Optional, List
from uuid import uuid4

from beanie import Document, before_event
from pydantic import Field


# Пріоритет задачі (LOW → URGENT)
class TaskPriority(str, Enum):
    LOW = "LOW"
    MIDDLE = "MIDDLE"
    HIGH = "HIGH"
    URGENT = "URGENT"


# Статуси задачі
class TaskStatus(str, Enum):
    TODO = "TODO"  # ще не розпочата
    IN_PROGRESS = "IN_PROGRESS"  # в процесі
    DONE = "DONE"  # завершена
    CANCELED = "CANCELED"  # скасована
    BLOCKED = "BLOCKED"  # заблокована (чекає на щось)
    OVERDUE = "OVERDUE"  # прострочена


# Одиниці інтервалу для регулярних задач
class TaskRecurrenceUnit(str, Enum):
    MINUTE = "MINUTE"
    HOUR = "HOUR"
    DAY = "DAY"
    WEEK = "WEEK"


# Дні тижня (для задач з повторенням по конкретних днях)
class Weekday(IntEnum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6


class Task(Document):
    # Унікальний ID задачі
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")

    # Хто створив задачу
    creator_id: str

    # Кому призначена (якщо None — буде встановлено автоматично на creator_id)
    assigned_to: Optional[str] = None

    # Назва задачі (обов'язкова, 3-255 символів)
    title: str = Field(..., min_length=3, max_length=255)

    # Опис задачі (необов'язковий)
    description: Optional[str] = None

    # Пріоритет задачі (за замовчуванням: MIDDLE)
    priority: TaskPriority = TaskPriority.MIDDLE

    # Статус задачі (за замовчуванням: TODO)
    status: TaskStatus = TaskStatus.TODO

    # Дедлайн задачі (опціональний)
    deadline: Optional[datetime] = None

    # Дата останнього оновлення (оновлюється автоматично перед update)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Дата створення задачі
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # === РЕГУЛЯРНІСТЬ ===

    # Чи є задача регулярною
    is_recurring: bool = False

    # Кожні N днів / тижнів (наприклад: кожні 2 дні, кожні 1 тиждень)
    recurrence_interval: Optional[int] = None

    # Одиниця інтервалу — DAY або WEEK
    recurrence_unit: Optional[TaskRecurrenceUnit] = None

    # Якщо вказані конкретні дні тижня (наприклад: [0, 2, 4] — понеділок, середа, п’ятниця)
    recurrence_weekdays: Optional[List[Weekday]] = None

    # Коли востаннє створювалась копія цієї задачі
    last_recurrence: Optional[datetime] = None

    # Якщо ця задача була створена як копія іншої регулярної задачі — тут зберігається її ID
    original_task_id: Optional[str] = None

    class Settings:
        name = "tasks"
        indexes = [
            "creator_id",
            "assigned_to",
            "priority",
            "status",
            "deadline",
            "_id",
            "is_recurring",
            "recurrence_weekdays",
            "original_task_id",
        ]

    @before_event("INSERT")
    async def set_assigned_to_on_insert(self):
        # Якщо виконавець не вказаний — ставимо creator_id
        if not self.assigned_to:
            self.assigned_to = self.creator_id

    @before_event("UPDATE")
    async def update_timestamp_on_update(self):
        # Перед оновленням документа — оновлюємо дату зміни
        self.updated_at = datetime.now(timezone.utc)
