
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ connectionStatus }) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">AI Chat Assistant</h1>
        <Badge variant="outline" className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-xs">{getStatusText()}</span>
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          Export Chat
        </Button>
        <Button variant="outline" size="sm">
          Clear History
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
