from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError

from app.config import settings

# Cliente global
client: AsyncIOMotorClient | None = None


def get_database():
    if client is None:
        raise RuntimeError("Base de datos no inicializada.")
    return client[settings.MONGODB_DB_NAME]


def get_mensajes_collection():
    return get_database()[settings.MONGODB_COLLECTION_MESSAGES]


async def connect_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    try:
        await client.admin.command("ping")
    except ServerSelectionTimeoutError as e:
        raise RuntimeError(
            f"No se pudo conectar a MongoDB en {settings.MONGODB_URI}. "
        ) from e


async def close_db() -> None:
    global client
    if client:
        client.close()
        client = None
