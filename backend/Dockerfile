# Backend Café Sentiment - FastAPI + MongoDB
FROM python:3.12-slim

WORKDIR /app

# Dependencias del sistema (opcional, para compilaciones)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# No copiar .env; las variables se inyectan por Docker Compose

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
