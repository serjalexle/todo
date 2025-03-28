from app.routes.admin_tasks_route import admin_tasks_router
from app.routes.admin_auth_route import admin_auth_router
from app.routes.admin_admin_route import admin_admin_router
from app.routes.admin_user_route import admin_user_router
from app.routes.admin_role_route import admin_role_router
from app.routes.auth_route import auth_router
from app.routes.tasks_route import tasks_router
from app.routes.admin_permissions_route import admin_permissions_router
from app.routes.scheduler_route import scheduler_router
from app.routes.login_history_route import login_history_router
from app.routes.admin_login_history_route import admin_login_history_router

# websockets
from app.websockets.routes import websocket_router


APP_ROUTES = [
    # admin
    admin_auth_router,
    admin_tasks_router,
    admin_admin_router,
    admin_user_router,
    admin_role_router,
    admin_permissions_router,
    admin_login_history_router,
    # user
    auth_router,
    tasks_router,
    scheduler_router,
    login_history_router,
    # technical
    websocket_router,
]
