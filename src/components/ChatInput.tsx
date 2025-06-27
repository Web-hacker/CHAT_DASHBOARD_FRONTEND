
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Github, Send, X, Stop } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[], githubUrl?: string) => void;
  onStopChat: () => void;
  onUpdatePrompt: (content: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onStopChat, 
  onUpdatePrompt,
  disabled = false,
  isStreaming = false 
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // TODO: API integration point for document upload
  const uploadDocument = async (file: File) => {
    console.log('Uploading document:', file.name);
    // Example API call structure:
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/upload', { method: 'POST', body: formData });
    // return response.json();
  };

  // TODO: API integration point for GitHub link processing
  const processGithubUrl = async (url: string) => {
    console.log('Processing GitHub URL:', url);
    // Example API call structure:
    // const response = await fetch('/api/github', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url })
    // });
    // return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0 && !githubUrl.trim()) {
      return;
    }

    if (isUpdatingPrompt) {
      // Update the last prompt
      onUpdatePrompt(message.trim());
      setIsUpdatingPrompt(false);
    } else {
      // Process attachments through API if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          await uploadDocument(file);
        }
      }

      // Process GitHub URL through API if provided
      if (githubUrl.trim()) {
        await processGithubUrl(githubUrl.trim());
      }

      // Send message
      onSendMessage(message.trim(), attachments, githubUrl.trim() || undefined);
    }

    // Reset form
    setMessage('');
    setAttachments([]);
    setGithubUrl('');
    setShowGithubInput(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    console.log('Files selected for upload:', files);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleStopChat = () => {
    onStopChat();
  };

  const handleUpdatePrompt = () => {
    setIsUpdatingPrompt(true);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Update prompt notification */}
        {isUpdatingPrompt && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-800">
                Update mode: Your next message will overwrite the previous prompt
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUpdatingPrompt(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Attachments display */}
        {attachments.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center space-x-2 px-3 py-2"
              >
                <Upload className="w-3 h-3" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* GitHub URL input */}
        {showGithubInput && (
          <div className="mb-4 flex items-center space-x-2">
            <Github className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Enter GitHub repository URL..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowGithubInput(false);
                setGithubUrl('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Main input form */}
        <form onSubmit={handleSubmit} className="flex items-end space-x-4">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder={
                disabled 
                  ? "Connecting to server..." 
                  : isUpdatingPrompt
                  ? "Enter your updated prompt..."
                  : "Type your message here... (Shift+Enter for new line)"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="min-h-[60px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Stop chat button (only show when streaming) */}
            {isStreaming && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStopChat}
                className="hover:bg-red-50 border-red-200 text-red-600"
              >
                <Stop className="w-4 h-4" />
              </Button>
            )}

            {/* Update prompt button (only show when not streaming and there are messages) */}
            {!isStreaming && !isUpdatingPrompt && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUpdatePrompt}
                disabled={disabled}
                className="hover:bg-yellow-50 border-yellow-200 text-yellow-600"
              >
                Update
              </Button>
            )}

            {/* File upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.xlsx"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="hover:bg-gray-50"
            >
              <Upload className="w-4 h-4" />
            </Button>

            {/* GitHub link */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGithubInput(!showGithubInput)}
              disabled={disabled}
              className={`hover:bg-gray-50 ${showGithubInput ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              <Github className="w-4 h-4" />
            </Button>

            {/* Send button */}
            <Button
              type="submit"
              disabled={disabled || (!message.trim() && attachments.length === 0 && !githubUrl.trim())}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {disabled 
            ? 'Waiting for connection...' 
            : isUpdatingPrompt
            ? 'Press Enter to update your prompt'
            : 'Press Enter to send, Shift+Enter for new line'
          }
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
