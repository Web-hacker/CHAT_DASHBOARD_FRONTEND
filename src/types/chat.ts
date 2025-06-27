
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: Attachment[];
  githubUrl?: string;
  isStreaming?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface WebSocketMessage {
  type: 'USER_MESSAGE' | 'STREAM_START' | 'STREAM_CHUNK' | 'STREAM_END' | 'ERROR';
  content?: string;
  messageId?: string;
  chunk?: string;
  attachments?: Attachment[];
  githubUrl?: string;
  timestamp?: string;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
