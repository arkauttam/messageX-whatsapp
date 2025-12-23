import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CallType = 'audio' | 'video';
export type CallDirection = 'incoming' | 'outgoing' | 'missed';

export interface Call {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: CallType;
  direction: CallDirection;
  timestamp: Date;
  duration?: number; // in seconds
}

interface CallsState {
  calls: Call[];
  addCall: (call: Omit<Call, 'id'>) => void;
  clearCalls: () => void;
}

const dummyCalls: Call[] = [
  {
    id: 'call_1',
    contactId: 'contact_1',
    contactName: 'Sarah Johnson',
    contactAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff&size=128',
    type: 'video',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 3600000),
    duration: 245,
  },
  {
    id: 'call_2',
    contactId: 'contact_2',
    contactName: 'Mike Chen',
    contactAvatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=22c55e&color=fff&size=128',
    type: 'audio',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 7200000),
    duration: 180,
  },
  {
    id: 'call_3',
    contactId: 'contact_3',
    contactName: 'Emily Davis',
    contactAvatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff&size=128',
    type: 'video',
    direction: 'missed',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 'call_4',
    contactId: 'contact_4',
    contactName: 'Alex Thompson',
    contactAvatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=f59e0b&color=fff&size=128',
    type: 'audio',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 172800000),
    duration: 420,
  },
  {
    id: 'call_5',
    contactId: 'contact_1',
    contactName: 'Sarah Johnson',
    contactAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff&size=128',
    type: 'audio',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 259200000),
    duration: 90,
  },
  {
    id: 'call_6',
    contactId: 'contact_5',
    contactName: 'Jordan Lee',
    contactAvatar: 'https://ui-avatars.com/api/?name=Jordan+Lee&background=8b5cf6&color=fff&size=128',
    type: 'video',
    direction: 'missed',
    timestamp: new Date(Date.now() - 345600000),
  },
];

export const useCallsStore = create<CallsState>()(
  persist(
    (set) => ({
      calls: dummyCalls,
      addCall: (call) => {
        set((state) => ({
          calls: [{ ...call, id: `call_${Date.now()}` }, ...state.calls],
        }));
      },
      clearCalls: () => {
        set({ calls: [] });
      },
    }),
    {
      name: 'whatsapp-calls',
    }
  )
);
