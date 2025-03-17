# ✅ Права для адміністраторів
ADMIN_PERMISSIONS = {
    "admin_create": "admin:create",
    "admin_read": "admin:read",
    "admin_update": "admin:update",
    "admin_delete": "admin:delete",
}

# ✅ Права для користувачів
USER_PERMISSIONS = {
    "user_create": "user:create",
    "user_read": "user:read",
    "user_update": "user:update",
    "user_delete": "user:delete",
}

# ✅ Права для ролей
ROLE_PERMISSIONS = {
    "role_create": "role:create",
    "role_read": "role:read",
    "role_update": "role:update",
    "role_delete": "role:delete",
}

# ✅ Права для задач (Tasks)
TASK_PERMISSIONS = {
    "task_create": "task:create",
    "task_read": "task:read",
    "task_update": "task:update",
    "task_delete": "task:delete",
}

PERMISSION_PERMISSIONS = {
    "permission_read": "permission:read",
}

# ✅ Об'єднуємо всі права
ALL_PERMISSIONS = {
    **ADMIN_PERMISSIONS,
    **USER_PERMISSIONS,
    **ROLE_PERMISSIONS,
    **TASK_PERMISSIONS,
    **PERMISSION_PERMISSIONS,
}
