from app.models.admin import Admin
from app.models.token import RefreshToken
from app.models.user import User
from app.models.task import Task


DB_MODELS = [User, Task, RefreshToken, Admin]
