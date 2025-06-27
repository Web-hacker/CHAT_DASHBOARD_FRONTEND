
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import UploadedItemsPanel from './UploadedItemsPanel';
import { Message, UploadedFile, GitHubLink } from '../types/chat';

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
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
        const messageId = Date.now().toString();
        setCurrentStreamingMessageId(messageId);
        // Add new AI message placeholder
        const newMessage: Message = {
          id: messageId,
          content: '',
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: true,
        };
        setMessages(prev => [...prev, newMessage]);
        break;

      case 'STREAM_CHUNK':
        // Update the streaming message with new content
        if (currentStreamingMessageId) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === currentStreamingMessageId 
                ? { ...msg, content: msg.content + data.content.content }
                : msg
            )
          );
        }
        break;

      case 'STREAM_END':
        setIsStreaming(false);
        setCurrentStreamingMessageId(null);
        // Mark message as complete
        if (currentStreamingMessageId) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === currentStreamingMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        }
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  };

  // Stop streaming chat
  const handleStopChat = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'STOP_STREAM'
      }));
      console.log('Sent stop stream request');
    }
    
    setIsStreaming(false);
    setCurrentStreamingMessageId(null);
    
    // Mark current streaming message as complete
    if (currentStreamingMessageId) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === currentStreamingMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    }
  };

  // Update prompt (overwrite last AI response)
  const handleUpdatePrompt = (newContent: string) => {
    // Find the last user message and update it
    setMessages(prev => {
      const lastUserIndex = prev.findLastIndex(msg => msg.sender === 'user');
      if (lastUserIndex !== -1) {
        const updatedMessages = [...prev];
        updatedMessages[lastUserIndex] = {
          ...updatedMessages[lastUserIndex],
          content: newContent,
          timestamp: new Date(),
        };
        
        // Remove all messages after the updated user message
        return updatedMessages.slice(0, lastUserIndex + 1);
      }
      return prev;
    });

    // Send updated message via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'UPDATE_PROMPT',
        content: {
          type: 'text',
          content: newContent,
        }
      };
      wsRef.current.send(JSON.stringify(payload));
      console.log('Sent updated prompt via WebSocket:', payload);
    }
  };

  // Send message via WebSocket
  const handleSendMessage = (content: string, attachments?: File[], githubUrl?: string) => {
    // Add uploaded files to state
    if (attachments && attachments.length > 0) {
      const newFiles: UploadedFile[] = attachments.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }

    // Add GitHub link to state
    if (githubUrl) {
      const newGithubLink: GitHubLink = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: githubUrl,
      };
      setGithubLinks(prev => [...prev, newGithubLink]);
    }

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Prepare WebSocket payload
    const payload = {
      type: 'USER_MESSAGE',
      content: {
        type: 'text',
        content,
      }
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

  // Delete uploaded file
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    console.log('Deleted file:', fileId);
  };

  // Delete GitHub link
  const handleDeleteGithubLink = (linkId: string) => {
    setGithubLinks(prev => prev.filter(link => link.id !== linkId));
    console.log('Deleted GitHub link:', linkId);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader connectionStatus={connectionStatus} />
      
      {/* Uploaded Items Panel */}
      {(uploadedFiles.length > 0 || githubLinks.length > 0) && (
        <UploadedItemsPanel
          uploadedFiles={uploadedFiles}
          githubLinks={githubLinks}
          onDeleteFile={handleDeleteFile}
          onDeleteGithubLink={handleDeleteGithubLink}
        />
      )}
      
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        onStopChat={handleStopChat}
        onUpdatePrompt={handleUpdatePrompt}
        disabled={connectionStatus !== 'connected'}
        isStreaming={isStreaming}
      />
    </div>
  );
};

export default ChatContainer;
