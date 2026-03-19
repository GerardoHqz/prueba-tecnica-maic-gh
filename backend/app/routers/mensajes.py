from fastapi import APIRouter

from app.services.message_service import listar_mensajes, obtener_sentimientos, obtener_temas

router = APIRouter()


@router.get("/api/mensajes", response_model=list)
async def ver_mensajes(limite: int = 100):
    return await listar_mensajes(limite=limite)


@router.get("/api/sentimientos", response_model=list)
async def ver_sentimientos():
    return await obtener_sentimientos()


@router.get("/api/temas", response_model=list)
async def ver_temas():
    return await obtener_temas()

