# Café de El Salvador – Dashboard de Sentimiento

Sistema de feedback por WhatsApp con análisis de sentimiento (IA) y dashboard en tiempo real.

## Ejecutar todo con Docker Compose (recomendado)

Desde la raíz del proyecto:

```bash
docker compose up --build
```

- **Frontend (dashboard):** http://localhost:5173  
- **Backend (API):** http://localhost:8000 — Docs: http://localhost:8000/docs  
- **MongoDB:** `localhost:27017` (solo para conexiones directas si las necesitas)

### Variables opcionales

- **Gemini (análisis IA):** Crea un archivo `.env` en la raíz con `GEMINI_API_KEY=tu_clave` y en `docker-compose.yml` descomenta la línea `# GEMINI_API_KEY: ${GEMINI_API_KEY}` en el servicio `backend`, o pasa la variable al hacer `GEMINI_API_KEY=xxx docker compose up --build`.

### Webhook Twilio

Con el backend en marcha (Docker o local), configura en Twilio la URL del webhook. Si corres solo con Docker en tu PC, usa **ngrok** u otro túnel para exponer `http://localhost:8000` y pon en Twilio: `https://tu-url-ngrok/webhook/whatsapp`.

---

## Ejecutar sin Docker (desarrollo local)

1. **MongoDB:** `docker compose up -d mongodb` (o instalar MongoDB local / Atlas).
2. **Backend:** `cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000`. Configura `.env` con `MONGODB_URI` y opcionalmente `GEMINI_API_KEY`.
3. **Frontend:** `cd frontend && npm install && npm run dev`. Crea `.env` con `VITE_API_URL=http://localhost:8000` si no usas el valor por defecto.

---

## Estructura

- `backend/` — FastAPI, webhook Twilio, Gemini, MongoDB  
- `frontend/` — React + Vite, dashboard (gráficos, feed de mensajes)  
- `docs/` — Plan de conexión frontend–backend y otros documentos  
- `docker-compose.yml` — MongoDB + backend + frontend
