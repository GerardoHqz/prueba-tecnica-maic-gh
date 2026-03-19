import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Message } from '../data/mock-data';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

interface MessagesFeedProps {
  messages: Message[];
}

export function MessagesFeed({ messages }: MessagesFeedProps) {
  const [selectedTheme, setSelectedTheme] = useState('todos');
  const [selectedSentiment, setSelectedSentiment] = useState('todos');
  const [selectedContentType, setSelectedContentType] = useState<'original' | 'resumen'>('original');

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negativo':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'neutro':
        return <Minus className="w-4 h-4 text-amber-400" />;
      default:
        return null;
    }
  };

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'negativo':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'neutro':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const themeOptions = useMemo(
    () => ['todos', ...Array.from(new Set(messages.map((message) => message.theme))).sort((a, b) => a.localeCompare(b))],
    [messages]
  );

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        const matchesTheme = selectedTheme === 'todos' || message.theme === selectedTheme;
        const matchesSentiment = selectedSentiment === 'todos' || message.sentiment === selectedSentiment;
        return matchesTheme && matchesSentiment;
      }),
    [messages, selectedTheme, selectedSentiment]
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-amber-700/20 rounded-3xl p-6 relative overflow-hidden hover:border-amber-600/40 transition-all duration-500"
    >
      {/* Decoración */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-900/50">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-100">Feed en Vivo</h2>
              <p className="text-amber-400/50 text-xs mt-0.5">Conversaciones recientes</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-amber-700/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-300/80 font-medium">{sortedMessages.length} mensajes</span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full rounded-xl border border-amber-700/30 bg-slate-900/70 px-3 py-2 text-sm text-amber-100 outline-none transition focus:border-amber-500"
          >
            {themeOptions.map((theme) => (
              <option key={theme} value={theme} className="bg-slate-900 text-amber-100">
                {theme === 'todos' ? 'Todos los temas' : theme}
              </option>
            ))}
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="w-full rounded-xl border border-amber-700/30 bg-slate-900/70 px-3 py-2 text-sm text-amber-100 outline-none transition focus:border-amber-500"
          >
            <option value="todos" className="bg-slate-900 text-amber-100">Todas las emociones</option>
            <option value="positivo" className="bg-slate-900 text-amber-100">Positivo</option>
            <option value="neutro" className="bg-slate-900 text-amber-100">Neutro</option>
            <option value="negativo" className="bg-slate-900 text-amber-100">Negativo</option>
          </select>

          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value as 'original' | 'resumen')}
            className="w-full rounded-xl border border-amber-700/30 bg-slate-900/70 px-3 py-2 text-sm text-amber-100 outline-none transition focus:border-amber-500"
          >
            <option value="original" className="bg-slate-900 text-amber-100">Mensaje original</option>
            <option value="resumen" className="bg-slate-900 text-amber-100">Resumen IA</option>
          </select>
        </div>

        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar-dark">
          {sortedMessages.map((message, index) => (
            <motion.div 
              key={message.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-amber-700/10 rounded-2xl p-4 hover:border-amber-600/30 hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {message.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-100 text-sm">{message.customerName}</span>
                      <div className="group-hover:scale-110 transition-transform">
                        {getSentimentIcon(message.sentiment)}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400/40">
                      {format(message.timestamp, "dd/MM/yyyy HH:mm", { locale: es })} ({formatDistanceToNow(message.timestamp, { addSuffix: true, locale: es })})
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-amber-100/80 text-sm leading-relaxed mb-3 pl-12">
                {selectedContentType === 'resumen'
                  ? (message.summary ?? 'Sin resumen IA disponible para este mensaje.')
                  : message.text}
              </p>
              
              <div className="flex gap-2 flex-wrap pl-12">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium ${getSentimentBadgeClass(message.sentiment)}`}>
                  {message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
                  {message.theme}
                </span>
              </div>
            </motion.div>
          ))}
          {sortedMessages.length === 0 && (
            <div className="rounded-2xl border border-amber-700/20 bg-slate-900/40 p-4 text-center text-sm text-amber-200/70">
              No hay mensajes para la combinación de filtros seleccionada.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}