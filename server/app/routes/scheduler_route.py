from fastapi import APIRouter, Depends, HTTPException
from app.workers.index import start_scheduler, stop_scheduler, scheduler
import asyncio
from app.utils.permissions import check_permission
from app.constants.constants import ALL_PERMISSIONS
from app.middleware.common import get_current_admin

scheduler_router = APIRouter(
    prefix="/api/tech/scheduler", tags=["Scheduler (Technical)"]
)


# ✅ Запуск APScheduler
@scheduler_router.post("/start", operation_id="start_scheduler_api")
async def start_scheduled_tasks(current_admin=Depends(get_current_admin)):
    """
    🔄 **Запускає планувальник (Scheduler)**

    Цей роут використовується для **запуску APScheduler**, який відповідає
    за **автоматичне оновлення прострочених задач** (переводить їх у статус `OVERDUE`).

    🛑 **Тільки для адміністраторів** з відповідними правами.
    """
    await check_permission(current_admin, ALL_PERMISSIONS["scheduler_control"])

    loop = asyncio.get_running_loop()
    start_scheduler(loop)

    return {"status": "✅ Scheduler started"}


# ✅ Зупинка APScheduler
@scheduler_router.post("/stop", operation_id="stop_scheduler_api")
async def stop_scheduled_tasks(current_admin=Depends(get_current_admin)):
    """
    ⛔ **Зупиняє планувальник (Scheduler)**

    Цей роут використовується для **зупинки APScheduler**, щоб тимчасово
    **відключити автоматичне оновлення прострочених задач**.

    🛑 **Тільки для адміністраторів** з відповідними правами.
    """
    await check_permission(current_admin, ALL_PERMISSIONS["scheduler_control"])

    stop_scheduler()

    return {"status": "⛔ Scheduler stopped"}


# ✅ Перевірка статусу Scheduler'а
@scheduler_router.get("/status", operation_id="check_scheduler_status_api")
async def check_scheduler_status(current_admin=Depends(get_current_admin)):
    """
    🛠 **Перевіряє статус Scheduler'а**

    Даний роут дозволяє перевірити, **чи запущений Scheduler** (`Running`) чи ні (`Stopped`).

    ✅ Якщо Scheduler працює, він **оновлює статус прострочених задач** (`TODO` → `OVERDUE`).

    🛑 **Тільки для адміністраторів** з відповідними правами.
    """
    await check_permission(current_admin, ALL_PERMISSIONS["scheduler_control"])

    is_running = scheduler.running
    return {"status": "✅ Running" if is_running else "⛔ Stopped"}
