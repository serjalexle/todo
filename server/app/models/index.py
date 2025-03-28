from app.models.admin import Admin
from app.models.token import RefreshToken
from app.models.user import User
from app.models.task import Task
from app.models.role import Role
from app.models.login_history import LoginHistory


DB_MODELS = [User, Task, RefreshToken, Admin, Role, LoginHistory]
