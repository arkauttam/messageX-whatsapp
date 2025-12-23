import { NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Circle, Phone, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { useStatusStore } from '@/store/statusStore';

const tabs = [
  { id: 'chats', label: 'Chats', icon: MessageCircle, path: '/' },
  { id: 'status', label: 'Status', icon: Circle, path: '/status' },
  { id: 'calls', label: 'Calls', icon: Phone, path: '/calls' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const BottomNav = () => {
  const location = useLocation();
  const { getUnreadCount } = useChatStore();
  const { statuses } = useStatusStore();
  
  const unreadChats = useChatStore.getState().contacts.reduce((acc, contact) => {
    return acc + getUnreadCount(contact.id);
  }, 0);
  
  const unviewedStatuses = statuses.filter(s => 
    !s.isMine && s.statuses.some(st => !st.viewed)
  ).length;

  const getBadgeCount = (id: string) => {
    switch (id) {
      case 'chats':
        return unreadChats;
      case 'status':
        return unviewedStatuses;
      default:
        return 0;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const badgeCount = getBadgeCount(tab.id);
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center px-1">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
