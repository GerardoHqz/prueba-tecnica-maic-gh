import type { Message } from '../data/mock-data';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface MensajeAPI {
  id: string;
  texto_mensaje: string;
  numero_remitente: string;
  timestamp: string;
  sentimiento?: string | null;
  tema?: string | null;
  resumen?: string | null;
}

function mapToMessage(item: MensajeAPI): Message {
  const sentiment = (item.sentimiento === 'positivo' || item.sentimiento === 'negativo' || item.sentimiento === 'neutro')
    ? item.sentimiento
    : 'neutro';
  return {
    id: item.id,
    text: item.texto_mensaje,
    sentiment,
    theme: item.tema ?? 'Otro',
    timestamp: new Date(item.timestamp),
    customerName: item.numero_remitente.replace(/^whatsapp:/i, '').trim() || 'Cliente',
  };
}

export async function fetchMessages(limit = 100): Promise<Message[]> {
  const res = await fetch(`${API_URL}/api/mensajes?limite=${limit}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const data: MensajeAPI[] = await res.json();
  return data.map(mapToMessage);
}
