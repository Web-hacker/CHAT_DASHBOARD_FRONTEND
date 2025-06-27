
import React, { useState } from 'react';
import { MessageSquare, Upload, Github, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'New Chat', timestamp: '2 min ago' },
    { id: '2', title: 'Document Analysis', timestamp: '1 hour ago' },
    { id: '3', title: 'GitHub Integration', timestamp: '3 hours ago' },
  ]);

  // Backend integration point for creating new conversations
  const handleNewChat = () => {
    console.log('Creating new chat - integrate with backend WebSocket');
    // TODO: WebSocket event to create new conversation
    // websocket.send(JSON.stringify({ type: 'NEW_CHAT' }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <Button 
          onClick={handleNewChat}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
          <MessageSquare className="w-4 h-4 mr-3" />
          All Chats
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
          <Upload className="w-4 h-4 mr-3" />
          Documents
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
          <Github className="w-4 h-4 mr-3" />
          GitHub Links
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Conversations</h3>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {conv.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {conv.timestamp}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-100">
        <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
