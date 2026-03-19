import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SentimentData } from '../data/mock-data';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentPieChartProps {
  data: SentimentData[];
}

export function SentimentPieChart({ data }: SentimentPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-amber-700/20 rounded-3xl p-6 relative overflow-hidden hover:border-amber-600/40 transition-all duration-500"
    >
      {/* Decoración */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-amber-100">Análisis Emocional</h2>
            <p className="text-amber-400/50 text-xs mt-1">Distribución de sentimientos</p>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="white" 
                    textAnchor={x > cx ? 'start' : 'end'} 
                    dominantBaseline="central"
                    className="text-sm font-bold"
                  >
                    {`${((value / total) * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              outerRadius={95}
              fill="#8884d8"
              dataKey="value"
              animationBegin={200}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value} mensajes`}
              contentStyle={{ 
                backgroundColor: 'rgba(30, 20, 16, 0.95)', 
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '12px',
                color: '#fbbf24'
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Leyenda Personalizada */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-slate-900/40 rounded-xl p-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs text-amber-200/80">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}