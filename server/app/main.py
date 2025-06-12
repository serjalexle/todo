from fastapi import FastAPI
from loguru import logger
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import init_db
from app.routes.index import APP_ROUTES

import asyncio
from app.workers.index import start_scheduler


async def lifespan(app: FastAPI):
    """Ініціалізація БД та запуск воркерів"""

    for route in APP_ROUTES:
        print(f"✅ Підключаємо роут: {route.prefix}")  # <-- Додано
        app.include_router(route)

    try:
        await init_db()

        # ОТРИМУЄМО event loop FastAPI
        loop = asyncio.get_running_loop()
        start_scheduler(loop)  # Передаємо loop у APScheduler

        logger.success("✅ APP STARTED SUCCESSFULLY")
        yield
    finally:
        logger.error("⛔ APP STOPPED")


app = FastAPI(
    lifespan=lifespan,
)

for route in APP_ROUTES:
    app.include_router(route)

# =====================
# CORS для розробки
# =====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
