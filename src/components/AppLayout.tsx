import { ReactNode, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { initializeTheme } from '@/store/themeStore';

interface AppLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export const AppLayout = ({ children, hideBottomNav = false }: AppLayoutProps) => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <main className={`flex-1 flex flex-col ${!hideBottomNav ? 'pb-16 md:pb-0' : ''}`}>
          {children}
        </main>
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
};
