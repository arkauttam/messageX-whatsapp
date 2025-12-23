import { useChatStore, Contact, Message } from '@/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, MoreVertical, Users } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { CreateGroupDialog } from './CreateGroupDialog';

interface ChatListProps {
  onSelectChat?: () => void;
}

export const ChatList = ({ onSelectChat }: ChatListProps) => {
  const { contacts, messages, activeContactId, searchQuery, setActiveContact, setSearchQuery } = useChatStore();

  const getLastMessage = (contactId: string): Message | undefined => {
    const contactMessages = messages.filter((m) => m.contactId === contactId);
    return contactMessages[contactMessages.length - 1];
  };

  const getUnreadCount = (contactId: string): number => {
    return messages.filter(
      (m) => m.contactId === contactId && !m.isSent && m.status !== 'seen'
    ).length;
  };

  const formatTime = (date: Date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    }
    if (isYesterday(messageDate)) {
      return 'Yesterday';
    }
    return format(messageDate, 'dd/MM/yyyy');
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const lastA = getLastMessage(a.id);
    const lastB = getLastMessage(b.id);
    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return new Date(lastB.timestamp).getTime() - new Date(lastA.timestamp).getTime();
  });

  const handleSelectContact = (contactId: string) => {
    setActiveContact(contactId);
    onSelectChat?.();
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-header-bg text-header-foreground md:bg-card md:text-foreground md:border-b md:border-border">
        <h1 className="text-xl font-semibold">Chats</h1>
        <div className="flex items-center gap-2">
          <CreateGroupDialog
            trigger={
              <button className="p-2 hover:bg-primary-foreground/10 md:hover:bg-muted rounded-full transition-colors">
                <Users className="w-5 h-5" />
              </button>
            }
          />
          <button className="p-2 hover:bg-primary-foreground/10 md:hover:bg-muted rounded-full transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-primary-foreground/10 md:hover:bg-muted rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-0 h-10 rounded-lg"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {sortedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-center">No chats found</p>
          </div>
        ) : (
          sortedContacts.map((contact) => {
            const lastMessage = getLastMessage(contact.id);
            const unreadCount = getUnreadCount(contact.id);
            const isActive = activeContactId === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50",
                  isActive && "bg-accent"
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && <span className="status-dot" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground truncate">
                      {contact.name}
                    </span>
                    {lastMessage && (
                      <span className={cn(
                        "text-xs flex-shrink-0 ml-2",
                        unreadCount > 0 ? "text-primary font-medium" : "text-muted-foreground"
                      )}>
                        {formatTime(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {contact.isTyping ? (
                        <span className="text-primary italic">typing...</span>
                      ) : lastMessage ? (
                        <>
                          {lastMessage.isSent && (
                            <span className="mr-1">
                              {lastMessage.status === 'seen' ? '✓✓' : lastMessage.status === 'delivered' ? '✓✓' : '✓'}
                            </span>
                          )}
                          {lastMessage.content}
                        </>
                      ) : (
                        contact.status
                      )}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full px-1.5">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
