export interface Message {
  id: string;
  text: string;
  sentiment: 'positivo' | 'negativo' | 'neutro';
  theme: string;
  timestamp: Date;
  customerName: string;
}

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'El café capuchino estaba delicioso, pero el servicio fue un poco lento.',
    sentiment: 'neutro',
    theme: 'Servicio',
    timestamp: new Date('2026-03-18T09:15:00'),
    customerName: 'María González'
  },
  {
    id: '2',
    text: '¡Excelente atención! El personal es muy amable y el café es de calidad premium.',
    sentiment: 'positivo',
    theme: 'Servicio',
    timestamp: new Date('2026-03-18T09:30:00'),
    customerName: 'Carlos Martínez'
  },
  {
    id: '3',
    text: 'Los precios están muy altos para lo que ofrecen.',
    sentiment: 'negativo',
    theme: 'Precio',
    timestamp: new Date('2026-03-18T10:00:00'),
    customerName: 'Ana López'
  },
  {
    id: '4',
    text: 'Me encanta el ambiente del lugar, muy acogedor y limpio.',
    sentiment: 'positivo',
    theme: 'Ambiente',
    timestamp: new Date('2026-03-18T10:20:00'),
    customerName: 'Roberto Flores'
  },
  {
    id: '5',
    text: 'El café con leche estaba tibio, esperaba que estuviera más caliente.',
    sentiment: 'negativo',
    theme: 'Calidad',
    timestamp: new Date('2026-03-18T10:45:00'),
    customerName: 'Laura Ramírez'
  },
  {
    id: '6',
    text: 'Buena ubicación y fácil de encontrar.',
    sentiment: 'positivo',
    theme: 'Ubicación',
    timestamp: new Date('2026-03-18T11:00:00'),
    customerName: 'Diego Hernández'
  },
  {
    id: '7',
    text: 'Las pupusas de acompañamiento son auténticas y deliciosas.',
    sentiment: 'positivo',
    theme: 'Comida',
    timestamp: new Date('2026-03-18T11:15:00'),
    customerName: 'Patricia Morales'
  },
  {
    id: '8',
    text: 'El wifi no funciona bien, tuve problemas para trabajar.',
    sentiment: 'negativo',
    theme: 'Servicios',
    timestamp: new Date('2026-03-18T11:30:00'),
    customerName: 'José Pérez'
  },
  {
    id: '9',
    text: 'Buen café, precios razonables.',
    sentiment: 'positivo',
    theme: 'Precio',
    timestamp: new Date('2026-03-18T11:45:00'),
    customerName: 'Sandra Torres'
  },
  {
    id: '10',
    text: 'El lugar estaba muy limpio y organizado. Volveré pronto.',
    sentiment: 'positivo',
    theme: 'Ambiente',
    timestamp: new Date('2026-03-18T12:00:00'),
    customerName: 'Miguel Ángel Ruiz'
  }
];

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export const getSentimentData = (messages: Message[]): SentimentData[] => {
  const sentimentCounts = messages.reduce((acc, msg) => {
    acc[msg.sentiment] = (acc[msg.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return [
    { name: 'Positivo', value: sentimentCounts['positivo'] || 0, color: '#10b981' },
    { name: 'Negativo', value: sentimentCounts['negativo'] || 0, color: '#ef4444' },
    { name: 'Neutro', value: sentimentCounts['neutro'] || 0, color: '#f59e0b' }
  ];
};

export interface ThemeData {
  name: string;
  count: number;
}

export const getThemeData = (messages: Message[]): ThemeData[] => {
  const themeCounts = messages.reduce((acc, msg) => {
    acc[msg.theme] = (acc[msg.theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(themeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};
