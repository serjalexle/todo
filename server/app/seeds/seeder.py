from app.models.admin import Admin
from app.models.role import Role
from app.utils.common import hash_password
from app.constants.constants import (
    USER_PERMISSIONS,
    TASK_PERMISSIONS,
    ALL_PERMISSIONS,
)


# ✅ Функція сідування
async def seed():
    print("🔄 Запуск сідування...")

    # 2️⃣ Перевіряємо, чи існує супер-адмін
    existing_superadmin = await Admin.find_one({"role": "superadmin"})
    if not existing_superadmin:
        print("🛠️  Створюємо супер-адміна...")
        superadmin = Admin(
            email="superadmin@example.com",
            password=hash_password("SuperSecure123$"),
            role="superadmin",
            permissions=list(
                ALL_PERMISSIONS.values()
            ),  # ✅ Використовуємо імпортовані права
        )
        await superadmin.insert()
        print("✅ Супер-адмін створений.")

    # 3️⃣ Перевіряємо, чи існують ролі
    existing_roles = await Role.find({}).to_list()
    if not existing_roles:
        print("🛠️  Створюємо базові ролі...")

        roles = [
            Role(name="superadmin", permissions=list(ALL_PERMISSIONS.values())),
            Role(
                name="moderator",
                permissions=[  # ✅ Обмежені права
                    USER_PERMISSIONS["user_read"],
                    USER_PERMISSIONS["user_update"],
                    TASK_PERMISSIONS["task_create"],
                    TASK_PERMISSIONS["task_update"],
                    TASK_PERMISSIONS["task_read"],
                ],
            ),
            Role(
                name="user",
                permissions=[
                    TASK_PERMISSIONS["task_read"],
                    TASK_PERMISSIONS["task_create"],
                ],
            ),
        ]

        await Role.insert_many(roles)
        print("✅ Базові ролі створені.")

    print("🎉 Сідування завершено!")
