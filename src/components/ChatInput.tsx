import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Github, Send, X, Square, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[], githubUrl?: string) => void;
  onStopChat: () => void;
  onStopAndRewrite: () => void;
  onUpdatePrompt: (content: string) => void;
  onRewritePrompt: (content: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  isRewriteMode?: boolean;
  lastUserMessage?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onStopChat, 
  onStopAndRewrite,
  onUpdatePrompt,
  onRewritePrompt,
  disabled = false,
  isStreaming = false,
  isRewriteMode = false,
  lastUserMessage = ''
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set the message to the last user message when entering rewrite mode
  useEffect(() => {
    if (isRewriteMode && lastUserMessage) {
      setMessage(lastUserMessage);
      textareaRef.current?.focus();
    }
  }, [isRewriteMode, lastUserMessage]);

  const uploadDocument = async (file: File) => {
    console.log('Uploading document:', file.name);
  };

  const processGithubUrl = async (url: string) => {
    console.log('Processing GitHub URL:', url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0 && !githubUrl.trim()) {
      return;
    }

    if (isRewriteMode) {
      onRewritePrompt(message.trim());
    } else if (isUpdatingPrompt) {
      onUpdatePrompt(message.trim());
      setIsUpdatingPrompt(false);
    } else {
      if (attachments.length > 0) {
        for (const file of attachments) {
          await uploadDocument(file);
        }
      }

      if (githubUrl.trim()) {
        await processGithubUrl(githubUrl.trim());
      }

      onSendMessage(message.trim(), attachments, githubUrl.trim() || undefined);
    }

    setMessage('');
    setAttachments([]);
    setGithubUrl('');
    setShowGithubInput(false);
    
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

  const handleStopAndRewrite = () => {
    onStopAndRewrite();
  };

  const handleUpdatePrompt = () => {
    setIsUpdatingPrompt(true);
    textareaRef.current?.focus();
  };

  const getPlaceholderText = () => {
    if (disabled) return "Connecting to server...";
    if (isRewriteMode) return "Rewrite your prompt to get a new response...";
    if (isUpdatingPrompt) return "Enter your updated prompt...";
    return "Type your message here... (Shift+Enter for new line)";
  };

  const getHelperText = () => {
    if (disabled) return 'Waiting for connection...';
    if (isRewriteMode) return 'Press Enter to send rewritten prompt and get a new response';
    if (isUpdatingPrompt) return 'Press Enter to update your prompt';
    return 'Press Enter to send, Shift+Enter for new line';
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="w-full max-w-none mx-auto p-3 sm:p-4 md:p-6">
        {/* Rewrite mode notification */}
        {isRewriteMode && (
          <div className="mb-3 sm:mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Rewrite mode: Edit your prompt to get a new response
              </span>
            </div>
          </div>
        )}

        {/* Update prompt notification */}
        {isUpdatingPrompt && (
          <div className="mb-3 sm:mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-yellow-800">
                Update mode: Your next message will overwrite the previous prompt
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUpdatingPrompt(false)}
                className="text-yellow-600 hover:text-yellow-800 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Attachments display */}
        {attachments.length > 0 && (
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <Upload className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-20 sm:max-w-32">{file.name}</span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  ({formatFileSize(file.size)})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100 shrink-0"
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
          <div className="mb-3 sm:mb-4 flex items-center space-x-2">
            <Github className="w-4 h-4 text-gray-500 shrink-0" />
            <Input
              placeholder="Enter GitHub repository URL..."
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="flex-1 min-w-0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowGithubInput(false);
                setGithubUrl('');
              }}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Main input form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 w-full">
            <Textarea
              ref={textareaRef}
              placeholder={getPlaceholderText()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="min-h-[60px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto">
            {/* Stop & Rewrite button (only show when streaming) */}
            {isStreaming && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStopAndRewrite}
                className="hover:bg-blue-50 border-blue-200 text-blue-600 shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Rewrite</span>
              </Button>
            )}

            {/* Stop chat button (only show when streaming) */}
            {isStreaming && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStopChat}
                className="hover:bg-red-50 border-red-200 text-red-600 shrink-0"
              >
                <Square className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Stop</span>
              </Button>
            )}

            {/* Update prompt button (only show when not streaming and not in rewrite mode) */}
            {!isStreaming && !isUpdatingPrompt && !isRewriteMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUpdatePrompt}
                disabled={disabled}
                className="hover:bg-yellow-50 border-yellow-200 text-yellow-600 shrink-0"
              >
                <span className="hidden sm:inline">Update</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}

            {/* File upload (hide in rewrite mode) */}
            {!isRewriteMode && (
              <>
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
                  className="hover:bg-gray-50 shrink-0"
                >
                  <Upload className="w-4 h-4" />
                </Button>

                {/* GitHub link (hide in rewrite mode) */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGithubInput(!showGithubInput)}
                  disabled={disabled}
                  className={`hover:bg-gray-50 shrink-0 ${showGithubInput ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <Github className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Send button */}
            <Button
              type="submit"
              disabled={disabled || (!message.trim() && attachments.length === 0 && !githubUrl.trim())}
              className={`shadow-lg shrink-0 ${
                isRewriteMode 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              } text-white`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">
                {isRewriteMode ? 'Rewrite' : 'Send'}
              </span>
            </Button>
          </div>
        </form>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {getHelperText()}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
