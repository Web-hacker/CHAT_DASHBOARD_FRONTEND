
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '../types/chat';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection management
  useEffect(() => {
    // TODO: Replace with your WebSocket URL
    const connectWebSocket = () => {
      console.log('Establishing WebSocket connection...');
      setConnectionStatus('connecting');
      
      // Example WebSocket connection - replace with your backend URL
      // wsRef.current = new WebSocket('ws://localhost:8080/chat');
      
      // Simulated connection for demo
      setTimeout(() => {
        setConnectionStatus('connected');
        console.log('WebSocket connected successfully');
      }, 1000);

      /* 
      WebSocket event handlers - uncomment when implementing
      
      wsRef.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected');
        console.log('WebSocket disconnected');
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };
      */
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    console.log('Received WebSocket message:', data);
    
    switch (data.type) {
      case 'STREAM_START':
        setIsStreaming(true);
        // Add new AI message placeholder
        const newMessage: Message = {
          id: data.messageId || Date.now().toString(),
          content: '',
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: true,
        };
        setMessages(prev => [...prev, newMessage]);
        break;

      case 'STREAM_CHUNK':
        // Update the streaming message with new content
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, content: msg.content + data.chunk }
              : msg
          )
        );
        break;

      case 'STREAM_END':
        setIsStreaming(false);
        // Mark message as complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  // Send message via WebSocket
  const handleSendMessage = (content: string, attachments?: File[], githubUrl?: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments?.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
      })),
      githubUrl,
    };

    setMessages(prev => [...prev, userMessage]);

    // Prepare WebSocket payload
    const payload = {
      type: 'USER_MESSAGE',
      content,
      messageId: userMessage.id,
      attachments: userMessage.attachments,
      githubUrl,
      timestamp: userMessage.timestamp.toISOString(),
    };

    // Send via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
      console.log('Sent message via WebSocket:', payload);
    } else {
      console.log('WebSocket not connected, message payload ready:', payload);
      
      // Simulate AI response for demo
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I received your message: "${content}". ${attachments?.length ? `You uploaded ${attachments.length} file(s). ` : ''}${githubUrl ? `GitHub URL: ${githubUrl}` : ''}`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader connectionStatus={connectionStatus} />
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput onSendMessage={handleSendMessage} disabled={connectionStatus !== 'connected'} />
    </div>
  );
};

export default ChatContainer;
