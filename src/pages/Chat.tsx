import { useState, useEffect } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatView } from '@/components/ChatView';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/lib/utils';

const Chat = () => {
  const [showChatView, setShowChatView] = useState(false);
  const { activeContactId, setActiveContact } = useChatStore();

  useEffect(() => {
    if (activeContactId) {
      setShowChatView(true);
    }
  }, [activeContactId]);

  const handleBack = () => {
    setShowChatView(false);
    setActiveContact(null);
  };

  const handleSelectChat = () => {
    setShowChatView(true);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main container with max-width for large screens */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto shadow-2xl overflow-hidden bg-card">
        {/* Sidebar / Chat List */}
        <div
          className={cn(
            "w-full md:w-[400px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-border",
            showChatView && "hidden md:flex"
          )}
        >
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* Chat View */}
        <div
          className={cn(
            "flex-1 flex flex-col bg-chat-bg",
            !showChatView && "hidden md:flex"
          )}
        >
          <ChatView onBack={handleBack} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
