from datetime import datetime, timedelta, timezone
from loguru import logger

from app.models.task import Task, TaskStatus, TaskRecurrenceUnit, Weekday
from app.config.env import ENVSettings


def should_generate_today(task: Task, now: datetime) -> bool:
    """Перевіряє, чи потрібно створити нову копію задачі"""
    if not task.is_recurring:
        return False

    # По днях тижня
    if task.recurrence_weekdays:
        return now.weekday() in task.recurrence_weekdays

    # По інтервалу
    if task.recurrence_interval and task.recurrence_unit:
        if not task.last_recurrence:
            return True  # перша генерація

        # 🛡️ Гарантуємо, що last_recurrence має tzinfo=UTC
        if task.last_recurrence.tzinfo is None:
            task.last_recurrence = task.last_recurrence.replace(tzinfo=timezone.utc)

        delta = now - task.last_recurrence

        # 🎯 Безпечне перетворення рядка в Enum
        try:
            unit = TaskRecurrenceUnit(task.recurrence_unit)
        except ValueError:
            logger.warning(f"⚠️ Unknown recurrence_unit: {task.recurrence_unit}")
            return False

        if unit == TaskRecurrenceUnit.MINUTE:
            return delta >= timedelta(minutes=task.recurrence_interval)
        elif unit == TaskRecurrenceUnit.HOUR:
            return delta >= timedelta(hours=task.recurrence_interval)
        elif unit == TaskRecurrenceUnit.DAY:
            return delta >= timedelta(days=task.recurrence_interval)
        elif unit == TaskRecurrenceUnit.WEEK:
            return delta >= timedelta(weeks=task.recurrence_interval)

    return False


async def generate_recurring_tasks():
    """Шукає регулярні задачі та створює копії, якщо пора"""
    now = datetime.now(timezone.utc)
    recurring_tasks = await Task.find(Task.is_recurring == True).to_list()
    print(recurring_tasks, "====================================")
    count = 0
    for task in recurring_tasks:
        if should_generate_today(task, now):
            new_task = Task(
                creator_id=task.creator_id,
                assigned_to=task.assigned_to,
                title=task.title,
                description=task.description,
                priority=task.priority,
                status=TaskStatus.TODO,
                deadline=task.deadline,
                is_recurring=False,  # копія не є регулярною
                original_task_id=task.id,
            )
            await new_task.insert()

            task.last_recurrence = now
            await task.save()
            count += 1

    if count:
        logger.success(f"[{now.isoformat()}] Generated {count} recurring task(s)")
    else:
        logger.info(f"[{now.isoformat()}] No recurring tasks to generate")


async def mark_overdue_tasks():
    """Оновлює статус всіх прострочених задач пакетами"""
    try:
        now = datetime.now(timezone.utc)

        # Отримуємо обмежену кількість задач, щоб не перевантажувати сервер
        tasks_to_update = (
            await Task.find(
                {
                    "status": {"$in": [TaskStatus.TODO, TaskStatus.IN_PROGRESS]},
                    "deadline": {"$lt": now},
                }
            )
            .limit(ENVSettings.MAX_UPDATES_OVERDUE_TASKS_PER_CYCLE)
            .to_list()
        )

        if tasks_to_update:
            task_ids = [task.id for task in tasks_to_update]

            # Масове оновлення в базі (MongoDB підтримує bulk update)
            await Task.find({"_id": {"$in": task_ids}}).update_many(
                {"$set": {"status": TaskStatus.OVERDUE}}
            )

            logger.success(
                f"[{datetime.now().isoformat()}] Updated {len(task_ids)} tasks to OVERDUE"
            )
        else:
            logger.info(f"[{datetime.now().isoformat()}] No overdue tasks found")
    except Exception as e:
        logger.error(f"❌ Error in mark_overdue_tasks: {e}")
