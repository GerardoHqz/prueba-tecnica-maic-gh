# Café de El Salvador - Dashboard de Sentimiento

Sistema de feedback por WhatsApp con análisis de sentimiento (IA) y dashboard en tiempo real.

## 1) Despliegue del proyecto

La solución se desplegó separando cada capa:

- **Frontend:** Vercel
- **Backend:** Render
- **Base de datos:** MongoDB Atlas

URL pública del dashboard:

- [https://prueba-tecnica-maic-gh-vercel.vercel.app](https://prueba-tecnica-maic-gh-vercel.vercel.app)

**Nota importante:** la primera carga puede tardar en mostrar datos porque Render suspende el servicio backend cuando no tiene actividad continua. Después de "despertar" el servicio, las siguientes peticiones responden normalmente.

## 2) Stack tecnológico y justificación técnica

### Frontend

- **React + Vite**
- **Tailwind CSS** para estilos y UI rápida
- **Recharts** para visualización de sentimientos y temas

Se eligió este stack por velocidad de desarrollo, recarga rápida en entorno local y facilidad para construir dashboards interactivos.

### Backend

- **FastAPI (Python)** para la API REST
- **Uvicorn** como servidor ASGI
- **Motor / PyMongo** para conexión asíncrona con MongoDB
- Integración con **Gemini API** para clasificación de sentimiento, tema y resumen

FastAPI se eligió por su rendimiento, tipado claro y facilidad para documentar endpoints.

### Base de datos

- **MongoDB** (local en Docker y en producción con Atlas)

#### Por qué una base no relacional (MongoDB) y no SQL relacional

Para este caso de uso, MongoDB aporta ventajas prácticas:

- El feedback de clientes es texto libre y puede evolucionar en estructura.
- El documento del mensaje se enriquece en dos fases (primero mensaje base, luego análisis IA), lo que encaja muy bien con documentos flexibles.
- Agregar campos nuevos de trazabilidad (por ejemplo `ai_model_id`, `ai_latency_ms`, `prompt_version`) no requiere migraciones rígidas de esquema.
- El dashboard consume agregaciones simples por tema/sentimiento que se resuelven bien con pipelines de MongoDB.

## 3) Ejecución local del proyecto

### Docker Compose (levanta todo)

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Servicios esperados:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **Docs API:** http://localhost:8000/docs
- **MongoDB:** `localhost:27017`

### Gemini API Key (opcional)

No se subieron los archivos `.env` al repositorio. Si se desea habilitar análisis IA con Gemini:

```bash
GEMINI_API_KEY=tu_clave docker compose up --build
```

Si `GEMINI_API_KEY` no está definida, la app igual funciona y guarda mensajes sin análisis IA.

### Opción sin Docker (desarrollo local manual)

1. Levantar MongoDB (local o Atlas).
2. Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Variables relevantes:

- Backend: `MONGODB_URI`, `MONGODB_DB_NAME`, `MONGODB_COLLECTION_MESSAGES`, `GEMINI_API_KEY` (opcional)
- Frontend: `VITE_API_URL` (si no se define, usa `http://localhost:8000`)

## 4) Estrategia de prompt utilizada para IA

La técnica principal utilizada es **few-shot prompting con salida estructurada**:

- Se define un **system prompt** con reglas explícitas.
- Se incluyen **ejemplos de salida** (few-shot) para guiar el formato y la semántica.
- Se exige respuesta en **JSON estricto** con tres campos:
  - `sentimiento` (`positivo`, `negativo`, `neutro`)
  - `tema` (`Servicio al Cliente`, `Calidad del Producto`, `Precio`, `Limpieza`, `Otro`)
  - `resumen` (frase corta)
- El backend valida la salida con **Pydantic** antes de persistir en base de datos.



## Estructura del repositorio

- `backend/` - FastAPI, webhook Twilio, servicio IA, MongoDB
- `frontend/` - React + Vite, dashboard (gráficos y feed)
- `docker-compose.yml` - Orquestación de MongoDB + backend + frontend
