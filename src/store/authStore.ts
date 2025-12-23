import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
  lastSeen: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, phone: string) => void;
  logout: () => void;
  updateStatus: (status: string) => void;
}

const generateAvatar = (name: string) => {
  const colors = ['22c55e', '3b82f6', 'f59e0b', 'ec4899', '8b5cf6', '14b8a6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (name: string, phone: string) => {
        const user: User = {
          id: `user_${Date.now()}`,
          name,
          phone,
          avatar: generateAvatar(name),
          status: 'Hey there! I am using WhatsApp',
          lastSeen: new Date(),
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateStatus: (status: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, status } : null,
        }));
      },
    }),
    {
      name: 'whatsapp-auth',
    }
  )
);
