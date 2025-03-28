from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class LoginHistoryOut(BaseModel):
    ip_address: str = Field(..., description="IP адреса")
    country: Optional[str] = Field(None, description="Країна")
    city: Optional[str] = Field(None, description="Місто")
    user_agent: Optional[str] = Field(None, description="Браузер або пристрій")
    created_at: datetime = Field(..., description="Час входу")
