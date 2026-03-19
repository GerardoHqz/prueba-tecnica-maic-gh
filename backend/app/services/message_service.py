from datetime import datetime
from typing import Any

from bson import ObjectId

from app.database import get_mensajes_collection
from app.models import MensajeInDB


async def guardar_mensaje(texto_mensaje: str, numero_remitente: str) -> tuple[MensajeInDB, ObjectId]:
    """
    Guarda un mensaje en MongoDB con texto_mensaje, numero_remitente y timestamp.
    Devuelve el mensaje y el _id insertado para poder actualizar el análisis después.
    """
    doc = MensajeInDB(
        texto_mensaje=texto_mensaje,
        numero_remitente=numero_remitente,
        timestamp=datetime.utcnow(),
    )
    col = get_mensajes_collection()
    payload: dict[str, Any] = doc.model_dump(mode="python", exclude_none=True)
    result = await col.insert_one(payload)
    return doc, result.inserted_id


async def actualizar_analisis_mensaje(
    mensaje_id: ObjectId,
    sentimiento: str,
    tema: str,
    resumen: str,
    ai_model_id: str | None = None,
    ai_latency_ms: float | None = None,
    prompt_version: str | None = None,
) -> None:
    """Actualiza el documento del mensaje con el resultado del análisis IA."""
    col = get_mensajes_collection()
    update: dict[str, Any] = {
        "sentimiento": sentimiento,
        "tema": tema,
        "resumen": resumen,
    }
    if ai_model_id is not None:
        update["ai_model_id"] = ai_model_id
    if ai_latency_ms is not None:
        update["ai_latency_ms"] = ai_latency_ms
    if prompt_version is not None:
        update["prompt_version"] = prompt_version
    await col.update_one({"_id": mensaje_id}, {"$set": update})

async def listar_mensajes(limite: int = 100) -> list[dict[str, Any]]:
    """Lista los mensajes guardados, más recientes primero. Cada ítem incluye 'id' (str del _id)."""
    col = get_mensajes_collection()
    cursor = col.find().sort("timestamp", -1).limit(limite)
    docs = await cursor.to_list(length=limite)
    out: list[dict[str, Any]] = []
    for d in docs:
        item = {k: v for k, v in d.items() if k != "_id"}
        if "_id" in d:
            item["id"] = str(d["_id"])
        out.append(item)
    return out


async def obtener_sentimientos() -> list[dict[str, Any]]:
    """Agregación: conteo por sentimiento (positivo, negativo, neutro, sin_clasificar)."""
    col = get_mensajes_collection()
    pipeline = [
        {"$group": {"_id": {"$ifNull": ["$sentimiento", "sin_clasificar"]}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    cursor = col.aggregate(pipeline)
    docs = await cursor.to_list(length=10)
    return [{"sentimiento": d["_id"], "cantidad": d["count"]} for d in docs]


async def obtener_temas() -> list[dict[str, Any]]:
    """Agregación: conteo por tema (Servicio al Cliente, Precio, etc.)."""
    col = get_mensajes_collection()
    pipeline = [
        {"$group": {"_id": {"$ifNull": ["$tema", "Otro"]}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    cursor = col.aggregate(pipeline)
    docs = await cursor.to_list(length=20)
    return [{"tema": d["_id"], "cantidad": d["count"]} for d in docs]