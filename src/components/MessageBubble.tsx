
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Upload } from 'lucide-react';
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

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`
                    flex items-center space-x-2 p-2 rounded-lg
                    ${isUser ? 'bg-white/20' : 'bg-white border border-gray-200'}
                  `}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm truncate">{attachment.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* GitHub URL */}
          {message.githubUrl && (
            <div className="mt-3">
              <Button
                variant={isUser ? "secondary" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => window.open(message.githubUrl, '_blank')}
              >
                <Github className="w-4 h-4" />
                <span>View Repository</span>
              </Button>
            </div>
          )}
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
