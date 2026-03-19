# Backend - Dashboard de Sentimiento (Café de El Salvador)

API con FastAPI que recibe mensajes vía webhook de Twilio y los guarda en MongoDB.

## Requisitos

- **Python 3.10+**
- **MongoDB**: local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)

### ¿Tienes MongoDB instalado?

En la terminal:

```bash
mongod --version
```

- Si **no** está instalado:
  - **Opción A (recomendada):** Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), crear un cluster gratis y copiar la cadena de conexión (`MONGODB_URI`).
  - **Opción B:** Instalar MongoDB Community: [Instalación Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/).

## Instalación

```bash
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
```

## Configuración

Copia `.env.example` a `.env` y ajusta:

```bash
copy .env.example .env
```

- Si usas **MongoDB local**: deja `MONGODB_URI=mongodb://localhost:27017` y asegúrate de tener el servicio MongoDB en ejecución.
- Si usas **Atlas**: pega tu URI en `MONGODB_URI`.
- **Gemini (opcional):** Para que cada mensaje se analice con IA (sentimiento, tema, resumen), define `GEMINI_API_KEY`. Crea una en [Google AI Studio](https://aistudio.google.com/app/apikey). Si no la defines, los mensajes se guardan igual pero sin análisis.

## Ejecutar

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado de la API y conexión a MongoDB |
| POST | `/webhook/whatsapp` | Webhook para Twilio (form: `Body`, `From`) |

Cada mensaje recibido se guarda en MongoDB con:

- `texto_mensaje`: cuerpo del mensaje
- `numero_remitente`: número del remitente (ej. `whatsapp:+50312345678`)
- `timestamp`: fecha/hora UTC de recepción

## Twilio WhatsApp Sandbox

El **Sandbox de WhatsApp** de Twilio solo acepta mensajes **de un único número**: el que “une” el sandbox.

1. **Cuenta Twilio:** [twilio.com](https://www.twilio.com) → regístrate (trial gratuito).
2. **WhatsApp Sandbox:** En la consola: [Messaging → Try it out → Send a WhatsApp message](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn). Ahí verás el número de prueba y un código tipo `join xxx-xxxx`.
3. **Unir tu número:** Desde **tu** WhatsApp, envía ese mensaje (ej. `join abc-hola`) al número de prueba. Solo ese número podrá enviar mensajes al sandbox.
4. **Webhook URL:** En la misma página, en “When a message comes in” pon la URL de tu webhook. En local necesitas un túnel (ej. [ngrok](https://ngrok.com)):  
   `https://TU_SUBDOMINIO.ngrok.io/webhook/whatsapp`
Resumen: en sandbox solo el número que hizo `join` puede enviar mensajes; el resto no llega al webhook.

## Probar el webhook sin Twilio

```bash
curl -X POST http://localhost:8000/webhook/whatsapp -d "Body=El café estuvo excelente" -d "From=whatsapp:+50312345678"
```
