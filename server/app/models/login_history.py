from beanie import Document
from datetime import datetime, timezone
from typing import Optional
from pydantic import Field


class LoginHistory(Document):
    user_id: str = Field(..., description="ID користувача або адміна")
    is_admin: bool = Field(..., description="Позначка, чи це адмін")
    ip_address: str = Field(..., description="IP-адреса")
    country: Optional[str] = Field(None, description="Країна (через geoIP)")
    city: Optional[str] = Field(None, description="Місто (через geoIP)")
    user_agent: Optional[str] = Field(None, description="Браузер / пристрій")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "login_history"
        indexes = [
            "user_id",
            "is_admin",
            "ip_address",
            "country",
            "city",
            "user_agent",
        ]
        # Унікальність не потрібна, бо може бути кілька входів з одного IP

        
