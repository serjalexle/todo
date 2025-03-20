import asyncio
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from loguru import logger

from app.models.task import Task, TaskStatus
from app.config.env import ENVSettings

# Ініціалізуємо APScheduler (глобально)
scheduler = BackgroundScheduler()


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


def start_scheduler(loop: asyncio.AbstractEventLoop):
    """Запускає APScheduler (якщо він ще не активний)"""
    if not scheduler.running:
        logger.info("✅ Starting APScheduler...")
        scheduler.start()

        def run_async_task():
            if scheduler.running:  # Переконуємось, що scheduler працює
                asyncio.run_coroutine_threadsafe(mark_overdue_tasks(), loop)
            else:
                logger.warning("⚠️ Scheduler is not running. Skipping task scheduling.")

        # Перевіряємо, чи Scheduler уже має задачу перед її додаванням
        if "mark_overdue_tasks" not in [job.id for job in scheduler.get_jobs()]:
            scheduler.add_job(
                func=run_async_task,
                trigger=IntervalTrigger(minutes=1),
                id="mark_overdue_tasks",
                name="Mark overdue tasks every 1 minute",
                replace_existing=True,
            )
            logger.success("✅ APScheduler started successfully!")
        else:
            logger.warning("⚠️ Task 'mark_overdue_tasks' is already scheduled!")
    else:
        logger.warning("⚠️ APScheduler is already running!")


def stop_scheduler():
    """Зупиняє APScheduler (для API-контролю)"""
    if scheduler.running:
        scheduler.shutdown(wait=False)  # Не чекаємо завершення задач
        logger.warning("⛔ APScheduler stopped!")
    else:
        logger.info("⚠️ APScheduler is already stopped!")
