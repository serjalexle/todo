import bcrypt

import jwt
from datetime import datetime, timedelta, timezone

from app.config.env import ENVSettings


# hash user password
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# verify user password
def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


# Generate JWT token
def generate_jwt(user_id: str, expires_delta: timedelta = timedelta(hours=1)) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "user_id": user_id,
        "exp": expire,
    }
    token = jwt.encode(payload, ENVSettings.JWT_KEY, algorithm="HS256")
    return token


# Verify JWT token
def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, ENVSettings.JWT_KEY, algorithms=["HS256"])

        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
