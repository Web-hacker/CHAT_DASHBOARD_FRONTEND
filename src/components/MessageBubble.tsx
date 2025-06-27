
import React from 'react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const isUser = message.sender === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-3xl ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-6 py-4 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-12' 
              : 'bg-gray-100 text-gray-900 mr-12 border border-gray-200'
            }
            ${message.isStreaming ? 'animate-pulse' : ''}
          `}
        >
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-5 bg-current opacity-75 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
