import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Mic, 
  Send,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Camera,
  Users
} from 'lucide-react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { GroupInfoSheet } from './GroupInfoSheet';

interface ChatViewProps {
  onBack?: () => void;
}

export const ChatView = ({ onBack }: ChatViewProps) => {
  const [message, setMessage] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { contacts, messages, activeContactId, setActiveContact, sendMessage } = useChatStore();

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const chatMessages = messages.filter((m) => m.contactId === activeContactId);
  const isGroup = activeContact?.isGroup;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!message.trim() || !activeContactId) return;
    sendMessage(activeContactId, message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  const formatDateDivider = (date: Date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return 'Today';
    if (isYesterday(messageDate)) return 'Yesterday';
    return format(messageDate, 'MMMM d, yyyy');
  };

  const getLastSeen = () => {
    if (!activeContact) return '';
    if (activeContact.isOnline) return 'online';
    const lastSeen = new Date(activeContact.lastSeen);
    if (isToday(lastSeen)) return `last seen today at ${format(lastSeen, 'HH:mm')}`;
    if (isYesterday(lastSeen)) return `last seen yesterday at ${format(lastSeen, 'HH:mm')}`;
    return `last seen ${format(lastSeen, 'MMM d')} at ${format(lastSeen, 'HH:mm')}`;
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-muted-foreground/50 rounded-full" />;
      case 'sent':
        return <Check className="w-4 h-4 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
      case 'seen':
        return <CheckCheck className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  const shouldShowDateDivider = (currentIndex: number) => {
    if (currentIndex === 0) return true;
    const currentDate = new Date(chatMessages[currentIndex].timestamp);
    const prevDate = new Date(chatMessages[currentIndex - 1].timestamp);
    return !isSameDay(currentDate, prevDate);
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-chat-pattern h-full">
        <div className="text-center p-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Phone className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">WhatsApp Web</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Send and receive messages without keeping your phone online.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 bg-header-bg text-header-foreground shadow-sm">
        <button 
          onClick={() => {
            setActiveContact(null);
            onBack?.();
          }}
          className="p-1.5 hover:bg-primary-foreground/10 rounded-full transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div 
          className="relative cursor-pointer"
          onClick={() => isGroup && setShowGroupInfo(true)}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
            <AvatarFallback className="bg-primary-foreground/20">
              {isGroup ? <Users className="w-5 h-5" /> : activeContact.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isGroup && activeContact.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-header-bg" />
          )}
        </div>

        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => isGroup && setShowGroupInfo(true)}
        >
          <h2 className="font-semibold truncate">{activeContact.name}</h2>
          <p className="text-xs text-primary-foreground/70">
            {activeContact.isTyping ? (
              <span className="text-primary-foreground">typing...</span>
            ) : isGroup ? (
              activeContact.status
            ) : (
              getLastSeen()
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-pattern p-4 scrollbar-thin">
        {chatMessages.map((msg, index) => (
          <div key={msg.id}>
            {/* Date divider */}
            {shouldShowDateDivider(index) && (
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-card rounded-lg text-xs text-muted-foreground shadow-sm">
                  {formatDateDivider(msg.timestamp)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={cn(
                "flex mb-1 animate-fade-in",
                msg.isSent ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] px-3 py-2 shadow-sm",
                  msg.isSent
                    ? "message-bubble-sent"
                    : "message-bubble-received"
                )}
              >
                {/* Show sender name in group chats */}
                {isGroup && !msg.isSent && msg.senderName && (
                  <p className="text-xs font-semibold text-primary mb-1">
                    {msg.senderName}
                  </p>
                )}
                <p className="text-sm text-foreground break-words">{msg.content}</p>
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  msg.isSent ? "justify-end" : "justify-start"
                )}>
                  <span className="text-[10px] text-muted-foreground">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                  {msg.isSent && renderStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {activeContact.isTyping && (
          <div className="flex justify-start mb-2 animate-fade-in">
            <div className="typing-indicator">
              <div className="typing-dot" style={{ animationDelay: '0ms' }} />
              <div className="typing-dot" style={{ animationDelay: '150ms' }} />
              <div className="typing-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 bg-muted/50">
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Smile className="w-6 h-6" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Paperclip className="w-6 h-6" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors md:hidden">
          <Camera className="w-6 h-6" />
        </button>
        
        <Input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-card border-0 rounded-full h-10 px-4"
        />
        
        {message.trim() ? (
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full w-10 h-10 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
            <Mic className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Group info sheet */}
      {isGroup && activeContact && (
        <GroupInfoSheet
          group={activeContact}
          open={showGroupInfo}
          onOpenChange={setShowGroupInfo}
        />
      )}
    </div>
  );
};
