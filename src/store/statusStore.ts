import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StatusItem {
  id: string;
  imageUrl: string;
  timestamp: Date;
  viewed: boolean;
}

export interface UserStatus {
  userId: string;
  userName: string;
  avatar: string;
  statuses: StatusItem[];
  isMine: boolean;
}

interface StatusState {
  statuses: UserStatus[];
  addStatus: (imageUrl: string) => void;
  viewStatus: (userId: string, statusId: string) => void;
}

const dummyStatuses: UserStatus[] = [
  {
    userId: 'contact_1',
    userName: 'Sarah Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff&size=128',
    statuses: [
      { id: 'status_1', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', timestamp: new Date(Date.now() - 3600000), viewed: false },
      { id: 'status_2', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', timestamp: new Date(Date.now() - 1800000), viewed: false },
    ],
    isMine: false,
  },
  {
    userId: 'contact_2',
    userName: 'Mike Chen',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=22c55e&color=fff&size=128',
    statuses: [
      { id: 'status_3', imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400', timestamp: new Date(Date.now() - 7200000), viewed: true },
    ],
    isMine: false,
  },
  {
    userId: 'contact_3',
    userName: 'Emily Davis',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff&size=128',
    statuses: [
      { id: 'status_4', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', timestamp: new Date(Date.now() - 900000), viewed: false },
    ],
    isMine: false,
  },
  {
    userId: 'contact_4',
    userName: 'Alex Thompson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=f59e0b&color=fff&size=128',
    statuses: [
      { id: 'status_5', imageUrl: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400', timestamp: new Date(Date.now() - 5400000), viewed: true },
    ],
    isMine: false,
  },
];

export const useStatusStore = create<StatusState>()(
  persist(
    (set, get) => ({
      statuses: dummyStatuses,
      addStatus: (imageUrl: string) => {
        const newStatus: StatusItem = {
          id: `status_${Date.now()}`,
          imageUrl,
          timestamp: new Date(),
          viewed: true,
        };
        
        set((state) => {
          const myStatusIndex = state.statuses.findIndex(s => s.isMine);
          if (myStatusIndex >= 0) {
            const updated = [...state.statuses];
            updated[myStatusIndex].statuses.push(newStatus);
            return { statuses: updated };
          }
          return state;
        });
      },
      viewStatus: (userId: string, statusId: string) => {
        set((state) => ({
          statuses: state.statuses.map(userStatus => 
            userStatus.userId === userId
              ? {
                  ...userStatus,
                  statuses: userStatus.statuses.map(s => 
                    s.id === statusId ? { ...s, viewed: true } : s
                  ),
                }
              : userStatus
          ),
        }));
      },
    }),
    {
      name: 'whatsapp-status',
    }
  )
);
