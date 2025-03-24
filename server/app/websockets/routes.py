from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websockets.connection_manager import manager
from app.middleware.common import get_current_admin

websocket_router = APIRouter(
    tags=["Websockets"],
)


@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Простий WebSocket-зв'язок без авторизації.
    Надсилає "pong" у відповідь на "ping".
    """
    await websocket.accept()
    print("✅ WebSocket connected")

    # 🔍 Вивід куків, якщо є
    if websocket.cookies:
        print("🍪 COOKIES RECEIVED:")
        for name, value in websocket.cookies.items():
            print(f"  {name}: {value}")
    else:
        print("🍪 No cookies found.")


    try:
        while True:
            message = await websocket.receive_text()
            print(f"📩 Received: {message}")

            if message.lower() == "ping":
                await websocket.send_text("pong")
            else:
                await websocket.send_text(f"echo: {message}")

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
