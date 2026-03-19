import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThemeData } from '../data/mock-data';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface ThemesBarChartProps {
  data: ThemeData[];
}

const COLORS = ['#f59e0b', '#fb923c', '#fdba74', '#fcd34d', '#fbbf24', '#f97316'];

export function ThemesBarChart({ data }: ThemesBarChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-amber-700/20 rounded-3xl p-6 relative overflow-hidden hover:border-amber-600/40 transition-all duration-500"
    >
      {/* Decoración */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-amber-100">Temas Trending</h2>
            <p className="text-amber-400/50 text-xs mt-1">Lo más mencionado</p>
          </div>
          <div className="p-2 bg-amber-500/20 rounded-xl">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="horizontal" margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 119, 6, 0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#fbbf24', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(217, 119, 6, 0.2)' }}
              interval={0}
              height={56}
              angle={-16}
              textAnchor="end"
              tickMargin={8}
              tickFormatter={(value: string) => (value.length > 12 ? `${value.slice(0, 12)}...` : value)}
            />
            <YAxis 
              tick={{ fill: '#fbbf24', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(217, 119, 6, 0.2)' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} menciones`, 'Frecuencia']}
              contentStyle={{ 
                backgroundColor: 'rgba(30, 20, 16, 0.95)', 
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '12px',
                color: '#fbbf24'
              }}
              cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              radius={[10, 10, 0, 0]}
              animationBegin={400}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Indicador de más popular */}
        {data.length > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs text-amber-200/80">
              <span className="font-semibold text-amber-100">{data[0].name}</span> es el tema más mencionado
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}