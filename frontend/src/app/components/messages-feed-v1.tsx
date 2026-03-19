import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Message } from '../data/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface MessagesFeedProps {
  messages: Message[];
}

export function MessagesFeed({ messages }: MessagesFeedProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negativo':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'neutro':
        return <Minus className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'bg-green-100 text-green-800';
      case 'negativo':
        return 'bg-red-100 text-red-800';
      case 'neutro':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedMessages = [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">Mensajes Recientes</h2>
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {sortedMessages.map((message) => (
          <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{message.customerName}</span>
                {getSentimentIcon(message.sentiment)}
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: es })}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{message.text}</p>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadgeClass(message.sentiment)}`}>
                {message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {message.theme}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
