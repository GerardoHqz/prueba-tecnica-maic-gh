from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

SENTIMIENTOS = Literal["positivo", "negativo", "neutro"]
TEMAS = Literal[
    "Servicio al Cliente",
    "Calidad del Producto",
    "Precio",
    "Limpieza",
    "Otro",
]


class MensajeCreate(BaseModel):
    texto_mensaje: str = Field(..., description="Cuerpo del mensaje recibido")
    numero_remitente: str = Field(..., description="Número del remitente (ej. whatsapp:+50312345678)")


class AnalisisRespuesta(BaseModel):
    """Respuesta esperada del LLM; validación estricta antes de persistir."""

    sentimiento: SENTIMIENTOS
    tema: TEMAS
    resumen: str = Field(..., min_length=1)


class MensajeInDB(BaseModel):
    texto_mensaje: str
    numero_remitente: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    sentimiento: Optional[str] = None
    tema: Optional[str] = None
    resumen: Optional[str] = None

    # campos de trazabilidad
    ai_model_id: Optional[str] = None
    ai_latency_ms: Optional[float] = None
    prompt_version: Optional[str] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
