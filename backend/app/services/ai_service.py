import asyncio
import json
import re
import time
from dataclasses import dataclass
from typing import Any

from google import genai as genai_sdk

from app.config import settings
from app.models import AnalisisRespuesta

PROMPT_VERSION = "1.0"

_SYSTEM_PROMPT = """Eres un analizador de feedback de clientes para una cadena de cafeterías.
Analiza el mensaje y responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown.
El JSON debe tener exactamente estas tres claves:
- "sentimiento": uno de "positivo", "negativo" o "neutro"
- "tema": uno de "Servicio al Cliente", "Calidad del Producto", "Precio", "Limpieza", "Otro"
- "resumen": una frase corta en español que resuma el mensaje (máximo 2 líneas)

Ejemplos de salida:
{"sentimiento": "positivo", "tema": "Calidad del Producto", "resumen": "El cliente está muy contento con el sabor del café."}
{"sentimiento": "negativo", "tema": "Limpieza", "resumen": "El cliente se queja de que las mesas estaban sucias."}
{"sentimiento": "neutro", "tema": "Precio", "resumen": "El cliente pregunta por los precios del menú."}
"""


@dataclass
class ResultadoAnalisis:
    analisis: AnalisisRespuesta
    latency_ms: float
    model_id: str
    prompt_version: str = PROMPT_VERSION


def _extraer_json(texto: str) -> dict[str, Any]:
    texto = texto.strip()
    # Quitar posible bloque markdown
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", texto)
    if match:
        texto = match.group(1).strip()
    return json.loads(texto)

"""Llamada síncrona a Gemini (se ejecuta en thread para no bloquear el event loop)."""
def _analizar_sync(texto: str) -> ResultadoAnalisis:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY no está configurada en .env")

    client = genai_sdk.Client(api_key=settings.GEMINI_API_KEY)
    prompt = f"{_SYSTEM_PROMPT}\n\nMensaje del cliente:\n{texto}"
    start = time.perf_counter()
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
    )
    latency_ms = (time.perf_counter() - start) * 1000
    raw = (response.text or "").strip()
    data = _extraer_json(raw)
    analisis = AnalisisRespuesta.model_validate(data)
    return ResultadoAnalisis(
        analisis=analisis,
        latency_ms=round(latency_ms, 2),
        model_id=settings.GEMINI_MODEL,
        prompt_version=PROMPT_VERSION,
    )


async def analizar_mensaje(texto: str) -> ResultadoAnalisis:
    return await asyncio.to_thread(_analizar_sync, texto)
