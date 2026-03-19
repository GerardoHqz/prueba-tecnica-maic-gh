import { Coffee, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { SentimentPieChart } from './components/sentiment-pie-chart';
import { ThemesBarChart } from './components/themes-bar-chart';
import { MessagesFeed } from './components/messages-feed';
import { mockMessages, getSentimentData, getThemeData } from './data/mock-data';

export default function App() {
  const sentimentData = getSentimentData(mockMessages);
  const themeData = getThemeData(mockMessages);
  
  const positiveCount = sentimentData.find(s => s.name === 'Positivo')?.value || 0;
  const totalMessages = mockMessages.length;
  const satisfactionRate = ((positiveCount / totalMessages) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 to-orange-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Coffee className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Café de El Salvador</h1>
              <p className="text-amber-100">Dashboard de Análisis de Feedback</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Mensajes</p>
                <p className="text-3xl font-bold text-gray-800">{totalMessages}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Satisfacción</p>
                <p className="text-3xl font-bold text-green-600">{satisfactionRate}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Clientes Activos</p>
                <p className="text-3xl font-bold text-gray-800">{mockMessages.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Temas Identificados</p>
                <p className="text-3xl font-bold text-gray-800">{themeData.length}</p>
              </div>
              <Coffee className="w-12 h-12 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SentimentPieChart data={sentimentData} />
          <ThemesBarChart data={themeData} />
        </div>

        {/* Messages Feed */}
        <MessagesFeed messages={mockMessages} />
      </div>
    </div>
  );
}
