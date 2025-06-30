import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import UploadedItemsPanel from './UploadedItemsPanel';
import { Message, UploadedFile, GitHubLink } from '../types/chat';

const BACKEND_IP = 'localhost';
const API_URL = `http://${BACKEND_IP}:3000`;
const WS_URL = `ws://${BACKEND_IP}:8000`;

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting'
  >('disconnected');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<
    string | null
  >(null);
  const [isRewriteMode, setIsRewriteMode] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const currentStreamingMessageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}?clientId=web-client-${Date.now()}`);
    wsRef.current = socket;
    setConnectionStatus('connecting');

    socket.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    socket.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setConnectionStatus('disconnected');
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  }, [messages]);


  const handleWebSocketMessage = (data: any) => {
    switch (data.eventtype) {
      case 'stream.start':
        {
          const messageId = Date.now().toString();
          setCurrentStreamingMessageId(messageId);
          currentStreamingMessageIdRef.current = messageId;
          setMessages((prev) => [
            ...prev,
            {
              id: messageId,
              content: '',
              sender: 'ai',
              timestamp: new Date(),
              isStreaming: true,
            },
          ]);
          setIsStreaming(true);
        }
        break;

      case 'stream.chunk':
        {
          const id = currentStreamingMessageIdRef.current;
          if (id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === id
                  ? { ...msg, content: msg.content + data.payload.message }
                  : msg,
              ),
            );
          }
        }
        break;

      case 'stream.end':
        {
          const endId = currentStreamingMessageIdRef.current;
          setIsStreaming(false);
          if (endId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === endId ? { ...msg, isStreaming: false } : msg,
              ),
            );
            setCurrentStreamingMessageId(null);
            currentStreamingMessageIdRef.current = null;
          }
        }
        break;

      case 'stream.error':
        console.error('Backend error:', data.payload?.message);
        break;

      default:
        console.warn('Unknown WebSocket eventtype:', data.eventtype);
    }
  };

  const sendEvent = (eventtype: string, payload: Record<string, any> = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ eventtype, payload }));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const handleSendMessage = (content: string) => {
    const messageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        content,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    sendEvent('websocket.stream', { message: content });
  };

  const handleUploadFiles = async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const {
          data: { docUniqueId },
        } = await axios.post(`${API_URL}/upload_docs`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            console.log(`Uploading "${file.name}": ${percent}%`);
          },
        });

        const uploaded: UploadedFile = {
          id: docUniqueId,
          name: file.name,
          type: file.type,
          size: file.size,
        };
        setUploadedFiles((prev) => [...prev, uploaded]);
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }
  };

  const handleSubmitGithubUrl = async (url: string, branch: string) => {
    const newLink: GitHubLink = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      github_url: url,
      branch,
    };
    setGithubLinks((prev) => [...prev, newLink]);

    try {
      await axios.post(`${API_URL}/upload_github`, newLink);
    } catch (err) {
      console.error('GitHub link upload failed:', err);
    }
  };

  const handleStopChat = () => {
    sendEvent('websocket.stream.stop');
    setIsStreaming(false);
    setCurrentStreamingMessageId(null);
  };

  const handleStopAndRewrite = () => {
    handleStopChat();

    if (currentStreamingMessageId) {
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== currentStreamingMessageId),
      );
    }

    const lastUserMsg = [...messages]
      .reverse()
      .find((msg) => msg.sender === 'user');
    if (lastUserMsg) {
      setLastUserMessage(lastUserMsg.content);
      setIsRewriteMode(true);
    }
  };

  const handleUpdatePrompt = async (newContent: string) => {
    try {
      await axios.post(`${API_URL}/prompt/update`, {
        message: newContent,
      });
    } catch (err) {
      console.error('Prompt update failed:', err);
    }

    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.sender === 'user');
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const updated = [...prev];
      updated[realIdx] = {
        ...updated[realIdx],
        content: newContent,
        timestamp: new Date(),
      };
      return updated.slice(0, realIdx + 1);
    });
  };

  const handleRewritePrompt = (newContent: string) => {
    handleUpdatePrompt(newContent);
    sendEvent('websocket.stream', { message: newContent });
    setIsRewriteMode(false);
    setLastUserMessage('');
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`${API_URL}/doc/${fileId}`);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('File deletion failed:', err);
    }
  };

  const handleDeleteGithubLink = async (linkId: string) => {
    setGithubLinks((prev) => prev.filter((l) => l.id !== linkId));
    try {
      await axios.delete(`${API_URL}/github_links/${linkId}`);
    } catch (err) {
      console.error('GitHub link deletion failed:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <ChatHeader connectionStatus={connectionStatus} />
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
        onUploadFiles={handleUploadFiles}
        onSubmitGithubUrl={handleSubmitGithubUrl}
        onStopChat={handleStopChat}
        onStopAndRewrite={handleStopAndRewrite}
        onUpdatePrompt={handleUpdatePrompt}
        onRewritePrompt={handleRewritePrompt}
        disabled={connectionStatus !== 'connected'}
        isStreaming={isStreaming}
        isRewriteMode={isRewriteMode}
        lastUserMessage={lastUserMessage}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
