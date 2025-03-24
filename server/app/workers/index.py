import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from loguru import logger


from app.workers.tasks import generate_recurring_tasks, mark_overdue_tasks


# Ініціалізуємо APScheduler (глобально)
scheduler = BackgroundScheduler()


def start_scheduler(loop: asyncio.AbstractEventLoop):
    """Запускає APScheduler (якщо він ще не активний)"""
    if not scheduler.running:
        logger.info("✅ Starting APScheduler...")
        scheduler.start()

        # ===== Запуск перевірки прострочених задач =====
        def run_async_task():
            if scheduler.running:
                asyncio.run_coroutine_threadsafe(mark_overdue_tasks(), loop)
            else:
                logger.warning("⚠️ Scheduler is not running. Skipping task scheduling.")

        if "mark_overdue_tasks" not in [job.id for job in scheduler.get_jobs()]:
            scheduler.add_job(
                func=run_async_task,
                trigger=IntervalTrigger(minutes=1),
                id="mark_overdue_tasks",
                name="Mark overdue tasks every 1 minute",
                replace_existing=True,
            )
            logger.success("✅ Scheduled 'mark_overdue_tasks'")
        else:
            logger.warning("⚠️ Task 'mark_overdue_tasks' is already scheduled!")

        # ===== Запуск генерації регулярних задач =====
        def run_generate_recurring():
            if scheduler.running:
                asyncio.run_coroutine_threadsafe(generate_recurring_tasks(), loop)
            else:
                logger.warning(
                    "⚠️ Scheduler is not running. Skipping recurring task generation."
                )

        if "generate_recurring_tasks" not in [job.id for job in scheduler.get_jobs()]:
            scheduler.add_job(
                func=run_generate_recurring,
                trigger=IntervalTrigger(minutes=5),
                id="generate_recurring_tasks",
                name="Generate recurring tasks every 1 minute",
                replace_existing=True,
            )
            logger.success("✅ Scheduled 'generate_recurring_tasks'")
        else:
            logger.warning("⚠️ Task 'generate_recurring_tasks' is already scheduled!")

        logger.success("✅ APScheduler started successfully!")
    else:
        logger.warning("⚠️ APScheduler is already running!")


def stop_scheduler():
    """Зупиняє APScheduler (для API-контролю)"""
    if scheduler.running:
        scheduler.shutdown(wait=False)  # Не чекаємо завершення задач
        logger.warning("⛔ APScheduler stopped!")
    else:
        logger.info("⚠️ APScheduler is already stopped!")
