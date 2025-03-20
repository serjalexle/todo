from fastapi import APIRouter, Depends, status
from app.middleware.common import get_current_admin
from app.constants.constants import ALL_PERMISSIONS
from app.utils.permissions import check_permission


admin_permissions_router = APIRouter(
    prefix="/api/admin/permissions", tags=["Admin Permissions Management"]
)


# ✅ Отримати список всіх доступних прав
@admin_permissions_router.get("/", status_code=status.HTTP_200_OK, operation_id="admin get permissions")
async def get_all_permissions(current_admin=Depends(get_current_admin)):
    """
    Отримати список всіх прав (тільки для адміністраторів, які мають право 'permission:read')
    """
    await check_permission(current_admin, "permission:read")

    return {"status": "success", "permissions": list(ALL_PERMISSIONS.values())}
