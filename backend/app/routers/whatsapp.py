import logging
from urllib.parse import parse_qs

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response

from app.config import settings
from app.services.ai_service import analizar_mensaje
from app.services.message_service import actualizar_analisis_mensaje, guardar_mensaje

logger = logging.getLogger(__name__)

router = APIRouter()


def _parse_twilio_form(body: bytes) -> dict[str, str]:
    decoded = body.decode("utf-8")
    parsed = parse_qs(decoded, keep_blank_values=True)
    return {k: (v[0] if v else "") for k, v in parsed.items()}


@router.post("/webhook/whatsapp")
async def webhook_whatsapp(request: Request):
    body_bytes = await request.body()
    form = _parse_twilio_form(body_bytes)

    body_text = (form.get("Body") or "").strip()
    from_number = form.get("From") or ""

    if not body_text:
        raise HTTPException(status_code=400, detail="El cuerpo del mensaje no puede estar vacío")
    if not from_number:
        raise HTTPException(status_code=400, detail="Falta el número remitente (From)")

    _, mensaje_id = await guardar_mensaje(texto_mensaje=body_text, numero_remitente=from_number)
    if settings.GEMINI_API_KEY:
        try:
            resultado = await analizar_mensaje(body_text)
            await actualizar_analisis_mensaje(
                mensaje_id,
                sentimiento=resultado.analisis.sentimiento,
                tema=resultado.analisis.tema,
                resumen=resultado.analisis.resumen,
                ai_model_id=resultado.model_id,
                ai_latency_ms=resultado.latency_ms,
                prompt_version=resultado.prompt_version,
            )
        except Exception as e:
            logger.exception("Error al analizar mensaje con IA: %s", e)
    else:
        logger.warning("GEMINI_API_KEY no configurada: mensaje guardado sin análisis.")

    return Response(content="", status_code=200)

