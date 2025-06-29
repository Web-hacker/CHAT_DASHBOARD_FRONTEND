// // // import React, { useState, useRef, useEffect } from 'react';
// // // import ChatHeader from './ChatHeader';
// // // import MessageList from './MessageList';
// // // import ChatInput from './ChatInput';
// // // import UploadedItemsPanel from './UploadedItemsPanel';
// // // import { Message, UploadedFile, GitHubLink } from '../types/chat';

// // // const ChatContainer = () => {
// // //   const [messages, setMessages] = useState<Message[]>([
// // //     {
// // //       id: '1',
// // //       content: 'Hello! I\'m your AI assistant. How can I help you today?',
// // //       sender: 'ai',
// // //       timestamp: new Date(),
// // //     }
// // //   ]);
// // //   const [isStreaming, setIsStreaming] = useState(false);
// // //   const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
// // //   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
// // //   const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
// // //   const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
// // //   const [isRewriteMode, setIsRewriteMode] = useState(false);
// // //   const [lastUserMessage, setLastUserMessage] = useState<string>('');
// // //   const wsRef = useRef<WebSocket | null>(null);

// // //   useEffect(() => {
// // //     const connectWebSocket = () => {
// // //       console.log('Establishing WebSocket connection...');
// // //       setConnectionStatus('connecting');
      
// // //       setTimeout(() => {
// // //         setConnectionStatus('connected');
// // //         console.log('WebSocket connected successfully');
// // //       }, 1000);
// // //     };

// // //     connectWebSocket();

// // //     return () => {
// // //       if (wsRef.current) {
// // //         wsRef.current.close();
// // //       }
// // //     };
// // //   }, []);

// // //   const handleWebSocketMessage = (data: any) => {
// // //     console.log('Received WebSocket message:', data);
    
// // //     switch (data.type) {
// // //       case 'STREAM_START':
// // //         setIsStreaming(true);
// // //         const messageId = Date.now().toString();
// // //         setCurrentStreamingMessageId(messageId);
// // //         const newMessage: Message = {
// // //           id: messageId,
// // //           content: '',
// // //           sender: 'ai',
// // //           timestamp: new Date(),
// // //           isStreaming: true,
// // //         };
// // //         setMessages(prev => [...prev, newMessage]);
// // //         break;

// // //       case 'STREAM_CHUNK':
// // //         if (currentStreamingMessageId) {
// // //           setMessages(prev => 
// // //             prev.map(msg => 
// // //               msg.id === currentStreamingMessageId 
// // //                 ? { ...msg, content: msg.content + data.content.content }
// // //                 : msg
// // //             )
// // //           );
// // //         }
// // //         break;

// // //       case 'STREAM_END':
// // //         setIsStreaming(false);
// // //         setCurrentStreamingMessageId(null);
// // //         if (currentStreamingMessageId) {
// // //           setMessages(prev => 
// // //             prev.map(msg => 
// // //               msg.id === currentStreamingMessageId 
// // //                 ? { ...msg, isStreaming: false }
// // //                 : msg
// // //             )
// // //           );
// // //         }
// // //         break;

// // //       default:
// // //         console.log('Unknown message type:', data.type);
// // //     }
// // //   };

// // //   const handleStopAndRewrite = () => {
// // //     // Stop the current streaming
// // //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// // //       wsRef.current.send(JSON.stringify({
// // //         type: 'STOP_STREAM'
// // //       }));
// // //       console.log('Sent stop stream request');
// // //     }
    
// // //     setIsStreaming(false);
// // //     setCurrentStreamingMessageId(null);
    
// // //     // Remove the streaming AI message
// // //     if (currentStreamingMessageId) {
// // //       setMessages(prev => prev.filter(msg => msg.id !== currentStreamingMessageId));
// // //     }
    
// // //     // Find the last user message to allow rewriting
// // //     const reversedMessages = [...messages].reverse();
// // //     const lastUserIndex = reversedMessages.findIndex(msg => msg.sender === 'user');
    
// // //     if (lastUserIndex !== -1) {
// // //       const actualIndex = messages.length - 1 - lastUserIndex;
// // //       const lastUserMsg = messages[actualIndex];
// // //       setLastUserMessage(lastUserMsg.content);
// // //       setIsRewriteMode(true);
// // //     }
// // //   };

// // //   const handleStopChat = () => {
// // //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// // //       wsRef.current.send(JSON.stringify({
// // //         type: 'STOP_STREAM'
// // //       }));
// // //       console.log('Sent stop stream request');
// // //     }
    
// // //     setIsStreaming(false);
// // //     setCurrentStreamingMessageId(null);
    
// // //     if (currentStreamingMessageId) {
// // //       setMessages(prev => 
// // //         prev.map(msg => 
// // //           msg.id === currentStreamingMessageId 
// // //             ? { ...msg, isStreaming: false }
// // //             : msg
// // //         )
// // //       );
// // //     }
// // //   };

// // //   const handleUpdatePrompt = (newContent: string) => {
// // //     setMessages(prev => {
// // //       const reversedMessages = [...prev].reverse();
// // //       const lastUserIndex = reversedMessages.findIndex(msg => msg.sender === 'user');
      
// // //       if (lastUserIndex !== -1) {
// // //         const actualIndex = prev.length - 1 - lastUserIndex;
// // //         const updatedMessages = [...prev];
// // //         updatedMessages[actualIndex] = {
// // //           ...updatedMessages[actualIndex],
// // //           content: newContent,
// // //           timestamp: new Date(),
// // //         };
        
// // //         return updatedMessages.slice(0, actualIndex + 1);
// // //       }
// // //       return prev;
// // //     });

// // //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// // //       const payload = {
// // //         type: 'UPDATE_PROMPT',
// // //         content: {
// // //           type: 'text',
// // //           content: newContent,
// // //         }
// // //       };
// // //       wsRef.current.send(JSON.stringify(payload));
// // //       console.log('Sent updated prompt via WebSocket:', payload);
// // //     }
// // //   };

// // //   const handleRewritePrompt = (newContent: string) => {
// // //     // Remove messages after the last user message
// // //     setMessages(prev => {
// // //       const reversedMessages = [...prev].reverse();
// // //       const lastUserIndex = reversedMessages.findIndex(msg => msg.sender === 'user');
      
// // //       if (lastUserIndex !== -1) {
// // //         const actualIndex = prev.length - 1 - lastUserIndex;
// // //         const updatedMessages = [...prev];
// // //         updatedMessages[actualIndex] = {
// // //           ...updatedMessages[actualIndex],
// // //           content: newContent,
// // //           timestamp: new Date(),
// // //         };
        
// // //         return updatedMessages.slice(0, actualIndex + 1);
// // //       }
// // //       return prev;
// // //     });

// // //     // Send the new prompt
// // //     const payload = {
// // //       type: 'USER_MESSAGE',
// // //       content: {
// // //         type: 'text',
// // //         content: newContent,
// // //       }
// // //     };

// // //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// // //       wsRef.current.send(JSON.stringify(payload));
// // //       console.log('Sent rewritten prompt via WebSocket:', payload);
// // //     }

// // //     setIsRewriteMode(false);
// // //     setLastUserMessage('');
// // //   };

// // //   const handleSendMessage = (content: string, attachments?: File[], githubUrl?: string) => {
// // //     if (attachments && attachments.length > 0) {
// // //       const newFiles: UploadedFile[] = attachments.map(file => ({
// // //         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
// // //         name: file.name,
// // //         type: file.type,
// // //         size: file.size,
// // //       }));
// // //       setUploadedFiles(prev => [...prev, ...newFiles]);
// // //     }

// // //     if (githubUrl) {
// // //       const newGithubLink: GitHubLink = {
// // //         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
// // //         url: githubUrl,
// // //       };
// // //       setGithubLinks(prev => [...prev, newGithubLink]);
// // //     }

// // //     const userMessage: Message = {
// // //       id: Date.now().toString(),
// // //       content,
// // //       sender: 'user',
// // //       timestamp: new Date(),
// // //     };

// // //     setMessages(prev => [...prev, userMessage]);

// // //     const payload = {
// // //       type: 'USER_MESSAGE',
// // //       content: {
// // //         type: 'text',
// // //         content,
// // //       }
// // //     };

// // //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// // //       wsRef.current.send(JSON.stringify(payload));
// // //       console.log('Sent message via WebSocket:', payload);
// // //     } else {
// // //       console.log('WebSocket not connected, message payload ready:', payload);
      
// // //       setTimeout(() => {
// // //         const aiResponse: Message = {
// // //           id: (Date.now() + 1).toString(),
// // //           content: `I received your message: "${content}". ${attachments?.length ? `You uploaded ${attachments.length} file(s). ` : ''}${githubUrl ? `GitHub URL: ${githubUrl}` : ''}`,
// // //           sender: 'ai',
// // //           timestamp: new Date(),
// // //         };
// // //         setMessages(prev => [...prev, aiResponse]);
// // //       }, 1000);
// // //     }
// // //   };

// // //   const handleDeleteFile = (fileId: string) => {
// // //     setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
// // //     console.log('Deleted file:', fileId);
// // //   };

// // //   const handleDeleteGithubLink = (linkId: string) => {
// // //     setGithubLinks(prev => prev.filter(link => link.id !== linkId));
// // //     console.log('Deleted GitHub link:', linkId);
// // //   };

// // //   return (
// // //     <div className="flex-1 flex flex-col bg-white min-h-0">
// // //       <ChatHeader connectionStatus={connectionStatus} />
      
// // //       {(uploadedFiles.length > 0 || githubLinks.length > 0) && (
// // //         <UploadedItemsPanel
// // //           uploadedFiles={uploadedFiles}
// // //           githubLinks={githubLinks}
// // //           onDeleteFile={handleDeleteFile}
// // //           onDeleteGithubLink={handleDeleteGithubLink}
// // //         />
// // //       )}
      
// // //       <MessageList messages={messages} isStreaming={isStreaming} />
// // //       <ChatInput 
// // //         onSendMessage={handleSendMessage}
// // //         onStopChat={handleStopChat}
// // //         onStopAndRewrite={handleStopAndRewrite}
// // //         onUpdatePrompt={handleUpdatePrompt}
// // //         onRewritePrompt={handleRewritePrompt}
// // //         disabled={connectionStatus !== 'connected'}
// // //         isStreaming={isStreaming}
// // //         isRewriteMode={isRewriteMode}
// // //         lastUserMessage={lastUserMessage}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default ChatContainer;

// // import React, { useState, useRef, useEffect } from 'react';
// // import ChatHeader from './ChatHeader';
// // import MessageList from './MessageList';
// // import ChatInput from './ChatInput';
// // import UploadedItemsPanel from './UploadedItemsPanel';
// // import { Message, UploadedFile, GitHubLink } from '../types/chat';

// // const ChatContainer = () => {
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [isStreaming, setIsStreaming] = useState(false);
// //   const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
// //   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
// //   const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
// //   const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
// //   const [isRewriteMode, setIsRewriteMode] = useState(false);
// //   const [lastUserMessage, setLastUserMessage] = useState<string>('');
// //   const wsRef = useRef<WebSocket | null>(null);

// //   useEffect(() => {
// //     const connectWebSocket = () => {
// //       const socket = new WebSocket(`ws://localhost:8080?clientId=web-client-${Date.now()}`);
// //       wsRef.current = socket;
// //       setConnectionStatus('connecting');

// //       socket.onopen = () => {
// //         console.log('WebSocket connected');
// //         setConnectionStatus('connected');
// //       };

// //       socket.onmessage = (event) => {
// //         const data = JSON.parse(event.data);
// //         handleWebSocketMessage(data);
// //       };

// //       socket.onclose = () => {
// //         console.log('WebSocket disconnected');
// //         setConnectionStatus('disconnected');
// //       };

// //       socket.onerror = (err) => {
// //         console.error('WebSocket error:', err);
// //         setConnectionStatus('disconnected');
// //       };
// //     };

// //     connectWebSocket();

// //     return () => {
// //       wsRef.current?.close();
// //     };
// //   }, []);

// //   const handleWebSocketMessage = (data: any) => {
// //     console.log('Received WebSocket message:', data);

// //     switch (data.eventtype) {
// //       case 'stream.start':
// //         setIsStreaming(true);
// //         const messageId = Date.now().toString();
// //         setCurrentStreamingMessageId(messageId);
// //         setMessages(prev => [...prev, {
// //           id: messageId,
// //           content: '',
// //           sender: 'ai',
// //           timestamp: new Date(),
// //           isStreaming: true
// //         }]);
// //         break;

// //       case 'stream.chunk':
// //         if (currentStreamingMessageId) {
// //           setMessages(prev =>
// //             prev.map(msg =>
// //               msg.id === currentStreamingMessageId
// //                 ? { ...msg, content: msg.content + data.payload.message }
// //                 : msg
// //             )
// //           );
// //         }
// //         break;

// //       case 'stream.end':
// //         setIsStreaming(false);
// //         if (currentStreamingMessageId) {
// //           setMessages(prev =>
// //             prev.map(msg =>
// //               msg.id === currentStreamingMessageId
// //                 ? { ...msg, isStreaming: false }
// //                 : msg
// //             )
// //           );
// //           setCurrentStreamingMessageId(null);
// //         }
// //         break;

// //       case 'error':
// //         console.error('Error from backend:', data.payload?.message);
// //         break;

// //       default:
// //         console.warn('Unhandled eventtype:', data.eventtype);
// //     }
// //   };

// //   const sendEvent = (eventtype: string, payload: Record<string, any> = {}) => {
// //     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
// //       const message = { eventtype, payload };
// //       wsRef.current.send(JSON.stringify(message));
// //       console.log('Sent message via WebSocket:', message);
// //     } else {
// //       console.warn('WebSocket not connected');
// //     }
// //   };

// //   const handleSendMessage = (content: string, attachments?: File[], githubUrl?: string) => {
// //     if (attachments?.length) {
// //       const newFiles = attachments.map(file => ({
// //         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
// //         name: file.name,
// //         type: file.type,
// //         size: file.size,
// //       }));
// //       setUploadedFiles(prev => [...prev, ...newFiles]);
// //     }

// //     if (githubUrl) {
// //       const newLink = {
// //         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
// //         url: githubUrl,
// //       };
// //       setGithubLinks(prev => [...prev, newLink]);
// //     }

// //     const userMessage: Message = {
// //       id: Date.now().toString(),
// //       content,
// //       sender: 'user',
// //       timestamp: new Date(),
// //     };
// //     setMessages(prev => [...prev, userMessage]);

// //     sendEvent('websocket.stream', { message: content });
// //   };

// //   const handleStopChat = () => {
// //     sendEvent('websocket.stream.stop');
// //     setIsStreaming(false);
// //     setCurrentStreamingMessageId(null);
// //   };

// //   const handleStopAndRewrite = () => {
// //     handleStopChat();

// //     if (currentStreamingMessageId) {
// //       setMessages(prev => prev.filter(msg => msg.id !== currentStreamingMessageId));
// //     }

// //     const lastUser = [...messages].reverse().find(msg => msg.sender === 'user');
// //     if (lastUser) {
// //       setLastUserMessage(lastUser.content);
// //       setIsRewriteMode(true);
// //     }
// //   };

// //   const handleUpdatePrompt = (newContent: string) => {
// //     sendEvent('websocket.stream.update', { message: newContent });

// //     setMessages(prev => {
// //       const lastUserIndex = [...prev].reverse().findIndex(msg => msg.sender === 'user');
// //       if (lastUserIndex === -1) return prev;

// //       const actualIndex = prev.length - 1 - lastUserIndex;
// //       const updated = [...prev];
// //       updated[actualIndex] = {
// //         ...updated[actualIndex],
// //         content: newContent,
// //         timestamp: new Date(),
// //       };
// //       return updated.slice(0, actualIndex + 1);
// //     });
// //   };

// //   const handleRewritePrompt = (newContent: string) => {
// //     setMessages(prev => {
// //       const lastUserIndex = [...prev].reverse().findIndex(msg => msg.sender === 'user');
// //       if (lastUserIndex === -1) return prev;

// //       const actualIndex = prev.length - 1 - lastUserIndex;
// //       const updated = [...prev];
// //       updated[actualIndex] = {
// //         ...updated[actualIndex],
// //         content: newContent,
// //         timestamp: new Date(),
// //       };
// //       return updated.slice(0, actualIndex + 1);
// //     });

// //     sendEvent('websocket.stream', { message: newContent });

// //     setIsRewriteMode(false);
// //     setLastUserMessage('');
// //   };

// //   const handleDeleteFile = (fileId: string) => {
// //     setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
// //   };

// //   const handleDeleteGithubLink = (linkId: string) => {
// //     setGithubLinks(prev => prev.filter(link => link.id !== linkId));
// //   };

// //   return (
// //     <div className="flex-1 flex flex-col bg-white min-h-0">
// //       <ChatHeader connectionStatus={connectionStatus} />
// //       {(uploadedFiles.length > 0 || githubLinks.length > 0) && (
// //         <UploadedItemsPanel
// //           uploadedFiles={uploadedFiles}
// //           githubLinks={githubLinks}
// //           onDeleteFile={handleDeleteFile}
// //           onDeleteGithubLink={handleDeleteGithubLink}
// //         />
// //       )}
// //       <MessageList messages={messages} isStreaming={isStreaming} />
// //       <ChatInput 
// //         onSendMessage={handleSendMessage}
// //         onStopChat={handleStopChat}
// //         onStopAndRewrite={handleStopAndRewrite}
// //         onUpdatePrompt={handleUpdatePrompt}
// //         onRewritePrompt={handleRewritePrompt}
// //         disabled={connectionStatus !== 'connected'}
// //         isStreaming={isStreaming}
// //         isRewriteMode={isRewriteMode}
// //         lastUserMessage={lastUserMessage}
// //       />
// //     </div>
// //   );
// // };

// // export default ChatContainer;

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import ChatHeader from './ChatHeader';
// import MessageList from './MessageList';
// import ChatInput from './ChatInput';
// import UploadedItemsPanel from './UploadedItemsPanel';
// import { Message, UploadedFile, GitHubLink } from '../types/chat';

// const ChatContainer = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
//   const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
//   const [isRewriteMode, setIsRewriteMode] = useState(false);
//   const [lastUserMessage, setLastUserMessage] = useState<string>('');
//   const wsRef = useRef<WebSocket | null>(null);
//   const currentStreamingMessageIdRef = useRef<string | null>(null);

//   useEffect(() => {
//     const socket = new WebSocket(`ws://localhost:8000?clientId=web-client-${Date.now()}`);
//     wsRef.current = socket;
//     setConnectionStatus('connecting');

//     socket.onopen = () => {
//       setConnectionStatus('connected');
//       console.log('WebSocket connected');
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log(data)
//       handleWebSocketMessage(data);
//     };

//     socket.onclose = () => {
//       setConnectionStatus('disconnected');
//       console.log('WebSocket disconnected');
//     };

//     socket.onerror = (err) => {
//       console.error('WebSocket error:', err);
//       setConnectionStatus('disconnected');
//     };

//     return () => socket.close();
//   }, []);

//   const handleWebSocketMessage = (data: any) => {
//     switch (data.eventtype) {
//       case 'stream.start':
//         console.log('Streaming is starting.')
//         const messageId = Date.now().toString();
//         console.log(messageId)
//         setCurrentStreamingMessageId(messageId);
//         currentStreamingMessageIdRef.current = messageId;
//         setMessages(prev => [...prev, {
//           id: messageId,
//           content: '',
//           sender: 'ai',
//           timestamp: new Date(),
//           isStreaming: true
//         }]);
//         setIsStreaming(true);
//         break;

//       case 'stream.chunk':
//         console.log(currentStreamingMessageId)
//         const id = currentStreamingMessageIdRef.current;
//         console.log(id)
//         console.log(data.payload.message)
//         if (id) {
//           console.log(data.payload.message)
//           setMessages(prev =>
//             prev.map(msg =>
//               msg.id === id
//                 ? { ...msg, content: msg.content + data.payload.message }
//                 : msg
//             )
//           );
//         }
//         break;

//       case 'stream.end':
//         const endId = currentStreamingMessageIdRef.current;
//         console.log('stream end.')
//         setIsStreaming(false);
//         if (endId) {
//           setMessages(prev =>
//             prev.map(msg =>
//               msg.id === endId
//                 ? { ...msg, isStreaming: false }
//                 : msg
//             )
//           );
//           setCurrentStreamingMessageId(null);
//           currentStreamingMessageIdRef.current = null;
//         }
//         break;

//       case 'stream.error':
//         console.error('Backend error:', data.payload?.message);
//         break;

//       default:
//         console.warn('Unknown WebSocket eventtype:', data.eventtype);
//     }
//   };

//   const sendEvent = (eventtype: string, payload: Record<string, any> = {}) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify({ eventtype, payload }));
//     } else {
//       console.warn('WebSocket not connected');
//     }
//   };

//   const handleSendMessage = async (content: string, attachments?: File[], githubUrl?: string) => {
//     const messageId = Date.now().toString();

//     setMessages(prev => [...prev, {
//       id: messageId,
//       content,
//       sender: 'user',
//       timestamp: new Date()
//     }]);

//     // Upload files
//     if (attachments?.length) {
//     for (const file of attachments) {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       await axios.post('http://localhost:3000/upload_docs', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//       onUploadProgress: (progressEvent) => {
//         const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         console.log(`Uploading "${file.name}": ${percent}%`);
//       }
//     });

//       // Optionally keep a record in local state
//       const uploaded: UploadedFile = {
//         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//         name: file.name,
//         type: file.type,
//         size: file.size
//       };
//       setUploadedFiles(prev => [...prev, uploaded]);

//     } catch (err) {
//       console.error('Binary file upload failed:', err);
//     }
//   }
// }


//     // Upload GitHub URL
//     if (githubUrl) {
//       const newLink: GitHubLink = {
//         id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         url: githubUrl
//       };
//       setGithubLinks(prev => [...prev, newLink]);

//       try {
//         await axios.post('/api/github-links', newLink);
//       } catch (err) {
//         console.error('GitHub link upload failed:', err);
//       }
//     }

//     // Send user message
//     sendEvent('websocket.stream', { message: content });
//   };

//   const handleStopChat = () => {
//     sendEvent('websocket.stream.stop');
//     setIsStreaming(false);
//     setCurrentStreamingMessageId(null);
//   };

//   const handleStopAndRewrite = () => {
//     handleStopChat();

//     if (currentStreamingMessageId) {
//       setMessages(prev => prev.filter(msg => msg.id !== currentStreamingMessageId));
//     }

//     const lastUserMsg = [...messages].reverse().find(msg => msg.sender === 'user');
//     if (lastUserMsg) {
//       setLastUserMessage(lastUserMsg.content);
//       setIsRewriteMode(true);
//     }
//   };

//   const handleUpdatePrompt = async (newContent: string) => {
//     try {
//       await axios.post('/api/prompt/update', { message: newContent });
//     } catch (err) {
//       console.error('Prompt update failed:', err);
//     }

//     setMessages(prev => {
//       const idx = [...prev].reverse().findIndex(m => m.sender === 'user');
//       if (idx === -1) return prev;
//       const realIdx = prev.length - 1 - idx;
//       const updated = [...prev];
//       updated[realIdx] = {
//         ...updated[realIdx],
//         content: newContent,
//         timestamp: new Date()
//       };
//       return updated.slice(0, realIdx + 1);
//     });
//   };

//   const handleRewritePrompt = (newContent: string) => {
//     handleUpdatePrompt(newContent);
//     sendEvent('websocket.stream', { message: newContent });
//     setIsRewriteMode(false);
//     setLastUserMessage('');
//   };

//   const handleDeleteFile = async (fileId: string) => {
//     setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
//     try {
//       await axios.delete(`/api/files/${fileId}`);
//     } catch (err) {
//       console.error('File deletion failed:', err);
//     }
//   };

//   const handleDeleteGithubLink = async (linkId: string) => {
//     setGithubLinks(prev => prev.filter(l => l.id !== linkId));
//     try {
//       await axios.delete(`/api/github-links/${linkId}`);
//     } catch (err) {
//       console.error('GitHub link deletion failed:', err);
//     }
//   };

//   // Optional prompt viewer
//   const handleViewPrompt = async () => {
//     try {
//       const response = await axios.get('/api/prompt/view');
//       console.log('Prompt:', response.data);
//       // Use response.data in your UI
//     } catch (err) {
//       console.error('Prompt view failed:', err);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-white min-h-0">
//       <ChatHeader connectionStatus={connectionStatus} />
//       {(uploadedFiles.length > 0 || githubLinks.length > 0) && (
//         <UploadedItemsPanel
//           uploadedFiles={uploadedFiles}
//           githubLinks={githubLinks}
//           onDeleteFile={handleDeleteFile}
//           onDeleteGithubLink={handleDeleteGithubLink}
//         />
//       )}
//       <MessageList messages={messages} isStreaming={isStreaming} />
//       <ChatInput 
//         onSendMessage={handleSendMessage}
//         onStopChat={handleStopChat}
//         onStopAndRewrite={handleStopAndRewrite}
//         onUpdatePrompt={handleUpdatePrompt}
//         onRewritePrompt={handleRewritePrompt}
//         disabled={connectionStatus !== 'connected'}
//         isStreaming={isStreaming}
//         isRewriteMode={isRewriteMode}
//         lastUserMessage={lastUserMessage}
//       />
//     </div>
//   );
// };

// export default ChatContainer;



import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import UploadedItemsPanel from './UploadedItemsPanel';
import { Message, UploadedFile, GitHubLink } from '../types/chat';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [githubLinks, setGithubLinks] = useState<GitHubLink[]>([]);
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
  const [isRewriteMode, setIsRewriteMode] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const currentStreamingMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000?clientId=web-client-${Date.now()}`);
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

  const handleWebSocketMessage = (data: any) => {
    switch (data.eventtype) {
      case 'stream.start':
        const messageId = Date.now().toString();
        setCurrentStreamingMessageId(messageId);
        currentStreamingMessageIdRef.current = messageId;
        setMessages(prev => [...prev, {
          id: messageId,
          content: '',
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: true
        }]);
        setIsStreaming(true);
        break;

      case 'stream.chunk':
        const id = currentStreamingMessageIdRef.current;
        if (id) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === id ? { ...msg, content: msg.content + data.payload.message } : msg
            )
          );
        }
        break;

      case 'stream.end':
        const endId = currentStreamingMessageIdRef.current;
        setIsStreaming(false);
        if (endId) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === endId ? { ...msg, isStreaming: false } : msg
            )
          );
          setCurrentStreamingMessageId(null);
          currentStreamingMessageIdRef.current = null;
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
    setMessages(prev => [...prev, {
      id: messageId,
      content,
      sender: 'user',
      timestamp: new Date()
    }]);
    sendEvent('websocket.stream', { message: content });
  };

  const handleUploadFiles = async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:3000/upload_docs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            console.log(`Uploading "${file.name}": ${percent}%`);
          }
        });

        const uploaded: UploadedFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size
        };
        setUploadedFiles(prev => [...prev, uploaded]);
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }
  };

  const handleSubmitGithubUrl = async (url: string) => {
    const newLink: GitHubLink = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url
    };
    setGithubLinks(prev => [...prev, newLink]);

    try {
      await axios.post('http://localhost:3000/github_links', newLink);
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
      setMessages(prev => prev.filter(msg => msg.id !== currentStreamingMessageId));
    }

    const lastUserMsg = [...messages].reverse().find(msg => msg.sender === 'user');
    if (lastUserMsg) {
      setLastUserMessage(lastUserMsg.content);
      setIsRewriteMode(true);
    }
  };

  const handleUpdatePrompt = async (newContent: string) => {
    try {
      await axios.post('http://localhost:3000/prompt/update', { message: newContent });
    } catch (err) {
      console.error('Prompt update failed:', err);
    }

    setMessages(prev => {
      const idx = [...prev].reverse().findIndex(m => m.sender === 'user');
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const updated = [...prev];
      updated[realIdx] = {
        ...updated[realIdx],
        content: newContent,
        timestamp: new Date()
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
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    try {
      await axios.delete(`http://localhost:3000/files/${fileId}`);
    } catch (err) {
      console.error('File deletion failed:', err);
    }
  };

  const handleDeleteGithubLink = async (linkId: string) => {
    setGithubLinks(prev => prev.filter(l => l.id !== linkId));
    try {
      await axios.delete(`http://localhost:3000/github_links/${linkId}`);
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
    </div>
  );
};

export default ChatContainer;
