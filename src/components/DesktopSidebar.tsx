import { NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Circle, Phone, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { useStatusStore } from '@/store/statusStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { id: 'chats', label: 'Chats', icon: MessageCircle, path: '/' },
  { id: 'status', label: 'Status', icon: Circle, path: '/status' },
  { id: 'calls', label: 'Calls', icon: Phone, path: '/calls' },
];

export const DesktopSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { getUnreadCount, contacts } = useChatStore();
  const { statuses } = useStatusStore();

  const unreadChats = contacts.reduce((acc, contact) => {
    return acc + getUnreadCount(contact.id);
  }, 0);

  const unviewedStatuses = statuses.filter(
    (s) => !s.isMine && s.statuses.some((st) => !st.viewed)
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
    <TooltipProvider delayDuration={200}>
      <aside className="hidden md:flex flex-col w-16 bg-header-bg text-header-foreground border-r border-border/20 h-full">
        {/* User Avatar */}
        <div className="p-3 flex justify-center">
          <Avatar className="w-10 h-10 ring-2 ring-primary-foreground/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary-foreground/20 text-header-foreground font-semibold">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const badgeCount = getBadgeCount(item.id);
            const Icon = item.icon;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    {badgeCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center px-1">
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/settings"
                className={cn(
                  'relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                  location.pathname === '/settings'
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <Settings className="w-6 h-6" />
                {location.pathname === '/settings' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};
