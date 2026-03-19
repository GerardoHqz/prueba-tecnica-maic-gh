import { useEffect, useState } from 'react';
import { Coffee, MessageSquare, Sparkles, Heart, Flame, Loader2, AlertCircle, Tag } from 'lucide-react';
import { SentimentPieChart } from './components/sentiment-pie-chart';
import { ThemesBarChart } from './components/themes-bar-chart';
import { MessagesFeed } from './components/messages-feed';
import { getSentimentData, getThemeData } from './data/mock-data';
import type { Message } from './data/mock-data';
import { fetchMessages } from './api/client';
import { motion } from 'motion/react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMessages()
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar mensajes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const sentimentData = getSentimentData(messages);
  const themeData = getThemeData(messages);

  const positiveCount = sentimentData.find(s => s.name === 'Positivo')?.value || 0;
  const totalMessages = messages.length;
  const satisfactionRate = totalMessages > 0 ? ((positiveCount / totalMessages) * 100).toFixed(1) : '0';
  const topTheme = themeData[0]?.name ?? 'Sin datos';

  return (
    <div className="min-h-screen bg-[#1a1311] relative overflow-hidden">
      {/* Fondo con patrón de granos de café */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #8b4513 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Decoración superior */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl"></div>

      {/* Header Artístico */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative border-b border-amber-900/30 bg-gradient-to-b from-[#2d1f1a] to-transparent"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 flex items-center justify-center transform -rotate-6 shadow-2xl">
                  <Coffee className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1a1311] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </motion.div>
              
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent"
                >
                  Café de El Salvador
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-amber-300/60 mt-2 text-lg flex items-center gap-2"
                >
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Centro de Inteligencia del Cliente
                </motion.p>
              </div>
            </div>

            {/* Fecha/Hora */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <p className="text-amber-400/80 text-sm">Análisis en Tiempo Real</p>
              <p className="text-amber-200/40 text-xs mt-1">Miércoles, 18 Marzo 2026</p>
              <a
                href="https://wa.link/6ye42o"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-500/20 px-3 py-2 text-xs font-semibold text-green-100 transition hover:bg-green-500/30"
              >
                <MessageSquare className="h-4 w-4" />
                Enviar mensajes
              </a>
              <p className="mt-2 text-[11px] text-amber-200/70">Codigo Twilio Sandbox</p>
              <p className="text-[11px] font-semibold text-amber-100">join atmosphere-ourselves</p>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-red-200"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-amber-700/30 bg-amber-900/20 px-4 py-8 text-amber-200"
          >
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando mensajes…</span>
          </motion.div>
        )}
        {/* Stats Grid - Layout Asimétrico */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          {/* Satisfacción - Card Grande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-5 bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-amber-800/40 backdrop-blur-md border border-amber-700/30 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-600/50 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-900/50">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-amber-300/70 text-sm uppercase tracking-wider">Satisfacción General</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-bold text-amber-100">{satisfactionRate}</span>
                <span className="text-3xl text-amber-400/60">%</span>
              </div>
              <p className="text-amber-400/50 text-sm mt-2">↑ +2.3% vs. semana anterior</p>
            </div>
          </motion.div>

          {/* Total Mensajes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-6 md:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-amber-700/20 rounded-3xl p-6 hover:border-amber-600/40 transition-all duration-500"
          >
            <div className="p-2.5 bg-amber-500/20 rounded-xl w-fit mb-3">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-2">Mensajes</p>
            <p className="text-4xl font-bold text-amber-100">{totalMessages}</p>
          </motion.div>

          {/* Tema del día */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-6 md:col-span-2 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-md border border-blue-700/20 rounded-3xl p-6 hover:border-blue-600/40 transition-all duration-500"
          >
            <div className="p-2.5 bg-blue-500/20 rounded-xl w-fit mb-3">
              <Tag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-blue-300/60 text-xs uppercase tracking-wider mb-2">Tema del día</p>
            <p className="text-xl font-bold text-blue-100 leading-tight">{topTheme}</p>
          </motion.div>

          {/* Temas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-2 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-md border border-purple-700/20 rounded-3xl p-6 hover:border-purple-600/40 transition-all duration-500"
          >
            <div className="p-2.5 bg-purple-500/20 rounded-xl w-fit mb-3">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-purple-300/60 text-xs uppercase tracking-wider mb-2">Temas</p>
            <p className="text-4xl font-bold text-purple-100">{themeData.length}</p>
          </motion.div>
        </div>

        {/* Charts Section - Layout Magazine */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-7">
            <MessagesFeed messages={messages} />
          </div>
          
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <SentimentPieChart data={sentimentData} />
            <ThemesBarChart data={themeData} />
          </div>
        </div>
      </div>
    </div>
  );
}