# Frontend Café Sentiment - React + Vite (modo dev para Docker Compose)
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
# Instala dependencias; react/react-dom pueden estar como peer → --legacy-peer-deps si hace falta
RUN npm install

COPY . .
# VITE_API_URL se inyecta por docker-compose (env al arrancar el contenedor)

EXPOSE 5173
CMD ["npm", "run", "dev"]
