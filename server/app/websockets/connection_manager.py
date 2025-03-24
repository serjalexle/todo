from typing import Dict
from fastapi import WebSocket


class ConnectionManager:
    """
    Менеджер WebSocket-з'єднань.
    Дозволяє зберігати сокет-з'єднання для кожного користувача та надсилати їм дані з будь-якого місця в коді.
    """

    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str) -> None:
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, data: dict) -> None:
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_json(data)


# Ініціалізуємо глобальний об'єкт менеджера
manager = ConnectionManager()
