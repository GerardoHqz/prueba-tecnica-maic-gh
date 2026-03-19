import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_db, connect_db
from app.routers.health import router as health_router
from app.routers.mensajes import router as mensajes_router
from app.routers.whatsapp import router as whatsapp_router

logger = logging.getLogger(__name__)

# administra la conexión a MongoDB
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Café El Salvador API",
    description="API para mensajes de WhatsApp y análisis de sentimiento",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(whatsapp_router)
app.include_router(mensajes_router)