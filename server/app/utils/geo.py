import httpx


# TODO: Переписати на на локальну базу даних щоб не залежати від сторонніх сервісів
async def get_geo_info(ip: str) -> tuple[str | None, str | None]:
    try:
        # Ігноруємо localhost або зарезервовані діапазони
        if ip.startswith("127.") or ip == "::1":
            return None, None

        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{ip}")
            data = response.json()
            return data.get("country"), data.get("city")
    except Exception:
        return None, None
