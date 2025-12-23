import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  lastSeen: Date;
  isTyping: boolean;
  isGroup?: boolean;
  members?: string[];
  createdBy?: string;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  senderId?: string;
  senderName?: string;
}

interface ChatState {
  contacts: Contact[];
  messages: Message[];
  activeContactId: string | null;
  searchQuery: string;

  setActiveContact: (contactId: string | null) => void;
  setSearchQuery: (query: string) => void;
  sendMessage: (contactId: string, content: string) => void;
  markAsSeen: (contactId: string) => void;
  setTyping: (contactId: string, isTyping: boolean) => void;
  toggleOnlineStatus: (contactId: string) => void;
  getUnreadCount: (contactId: string) => number;

  // Group functions
  createGroup: (name: string, memberIds: string[]) => void;
  updateGroupName: (groupId: string, name: string) => void;
  addMemberToGroup: (groupId: string, memberId: string) => void;
  removeMemberFromGroup: (groupId: string, memberId: string) => void;
  leaveGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
}

const autoReplies = [
  "That sounds great! 😊",
  "Sure, let me check and get back to you",
  "Haha, you're funny! 😂",
  "I'll be there in 10 minutes",
  "Can we talk later? I'm a bit busy right now",
  "Perfect! See you then 👍",
  "Thanks for letting me know!",
  "I was just thinking about that!",
  "Absolutely! Count me in",
  "Let me know if you need anything else",
  "That's awesome news! 🎉",
  "I'm on my way!",
  "Just saw your message, sorry for the delay",
  "Sounds like a plan! ✨",
];

const dummyContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    phone: '+1 234 567 8901',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    status: 'Living my best life ✨',
    isOnline: true,
    lastSeen: new Date(),
    isTyping: false,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    phone: '+1 234 567 8902',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'At work 💼',
    isOnline: true,
    lastSeen: new Date(),
    isTyping: false,
  },
  {
    id: '3',
    name: 'Emily Davis',
    phone: '+1 234 567 8903',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'Coffee addict ☕',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000),
    isTyping: false,
  },
  {
    id: '4',
    name: 'David Chen',
    phone: '+1 234 567 8904',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: 'Busy coding 💻',
    isOnline: true,
    lastSeen: new Date(),
    isTyping: false,
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    phone: '+1 234 567 8905',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    status: 'Weekend vibes 🌴',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000),
    isTyping: false,
  },
  {
    id: '6',
    name: 'Team Project',
    phone: 'Group',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
    status: '5 participants',
    isOnline: false,
    lastSeen: new Date(),
    isTyping: false,
    isGroup: true,
    members: ['1', '2', '3', '4'],
    createdBy: 'user',
  },
  {
    id: '7',
    name: 'Alex Thompson',
    phone: '+1 234 567 8907',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'Available',
    isOnline: true,
    lastSeen: new Date(),
    isTyping: false,
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    phone: '+1 234 567 8908',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    status: 'Gym time 💪',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    isTyping: false,
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    contactId: '1',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 3600000),
    isSent: false,
    status: 'seen',
  },
  {
    id: '2',
    contactId: '1',
    content: "I'm great! Just finished work. What about you?",
    timestamp: new Date(Date.now() - 3500000),
    isSent: true,
    status: 'seen',
  },
  {
    id: '3',
    contactId: '1',
    content: "Same here! Want to grab dinner later?",
    timestamp: new Date(Date.now() - 3400000),
    isSent: false,
    status: 'seen',
  },
  {
    id: '4',
    contactId: '2',
    content: "Don't forget the meeting at 3 PM!",
    timestamp: new Date(Date.now() - 7200000),
    isSent: false,
    status: 'seen',
  },
  {
    id: '5',
    contactId: '2',
    content: 'Thanks for the reminder! I already set an alarm 👍',
    timestamp: new Date(Date.now() - 7100000),
    isSent: true,
    status: 'seen',
  },
  {
    id: '6',
    contactId: '3',
    content: "Check out this photo from the trip!",
    timestamp: new Date(Date.now() - 86400000),
    isSent: false,
    status: 'seen',
  },
  {
    id: '7',
    contactId: '4',
    content: "Can you review my PR when you have time?",
    timestamp: new Date(Date.now() - 1800000),
    isSent: false,
    status: 'seen',
  },
  {
    id: '8',
    contactId: '5',
    content: "Happy birthday! 🎂🎉",
    timestamp: new Date(Date.now() - 172800000),
    isSent: true,
    status: 'seen',
  },
  // Group messages
  {
    id: '9',
    contactId: '6',
    content: "Hey team! How's the project going?",
    timestamp: new Date(Date.now() - 5400000),
    isSent: false,
    status: 'seen',
    senderId: '1',
    senderName: 'Sarah Wilson',
  },
  {
    id: '10',
    contactId: '6',
    content: "Making good progress! Should be done by Friday",
    timestamp: new Date(Date.now() - 5300000),
    isSent: false,
    status: 'seen',
    senderId: '2',
    senderName: 'Mike Johnson',
  },
  {
    id: '11',
    contactId: '6',
    content: "Great work everyone! 🎉",
    timestamp: new Date(Date.now() - 5200000),
    isSent: true,
    status: 'seen',
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      contacts: dummyContacts,
      messages: initialMessages,
      activeContactId: null,
      searchQuery: '',

      setActiveContact: (contactId) => {
        set({ activeContactId: contactId });
        if (contactId) {
          get().markAsSeen(contactId);
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      sendMessage: (contactId, content) => {
        const contact = get().contacts.find((c) => c.id === contactId);
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          contactId,
          content,
          timestamp: new Date(),
          isSent: true,
          status: 'sending',
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // Simulate message status updates
        setTimeout(() => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
            ),
          }));
        }, 500);

        setTimeout(() => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
            ),
          }));
        }, 1000);

        setTimeout(() => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
            ),
          }));
        }, 2000);

        // Simulate typing and auto-reply for groups or online contacts
        if (contact) {
          if (contact.isGroup && contact.members && contact.members.length > 0) {
            // Random member replies in group
            const randomMemberId =
              contact.members[Math.floor(Math.random() * contact.members.length)];
            const randomMember = get().contacts.find((c) => c.id === randomMemberId);

            if (randomMember) {
              setTimeout(() => {
                get().setTyping(contactId, true);
              }, 1500);

              setTimeout(() => {
                get().setTyping(contactId, false);
                const replyContent =
                  autoReplies[Math.floor(Math.random() * autoReplies.length)];
                const replyMessage: Message = {
                  id: `msg_${Date.now()}_reply`,
                  contactId,
                  content: replyContent,
                  timestamp: new Date(),
                  isSent: false,
                  status: 'seen',
                  senderId: randomMember.id,
                  senderName: randomMember.name,
                };
                set((state) => ({
                  messages: [...state.messages, replyMessage],
                }));
              }, 3000 + Math.random() * 2000);
            }
          } else if (contact.isOnline) {
            setTimeout(() => {
              get().setTyping(contactId, true);
            }, 1500);

            setTimeout(() => {
              get().setTyping(contactId, false);
              const replyContent =
                autoReplies[Math.floor(Math.random() * autoReplies.length)];
              const replyMessage: Message = {
                id: `msg_${Date.now()}_reply`,
                contactId,
                content: replyContent,
                timestamp: new Date(),
                isSent: false,
                status: 'seen',
              };
              set((state) => ({
                messages: [...state.messages, replyMessage],
              }));
            }, 3000 + Math.random() * 2000);
          }
        }
      },

      markAsSeen: (contactId) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.contactId === contactId && !msg.isSent ? { ...msg, status: 'seen' } : msg
          ),
        }));
      },

      setTyping: (contactId, isTyping) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId ? { ...contact, isTyping } : contact
          ),
        }));
      },

      toggleOnlineStatus: (contactId) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, isOnline: !contact.isOnline, lastSeen: new Date() }
              : contact
          ),
        }));
      },

      getUnreadCount: (contactId) => {
        const state = get();
        return state.messages.filter(
          (msg) => msg.contactId === contactId && !msg.isSent && msg.status !== 'seen'
        ).length;
      },

      // Group functions
      createGroup: (name, memberIds) => {
        const newGroup: Contact = {
          id: `group_${Date.now()}`,
          name,
          phone: 'Group',
          avatar: '',
          status: `${memberIds.length + 1} participants`,
          isOnline: false,
          lastSeen: new Date(),
          isTyping: false,
          isGroup: true,
          members: memberIds,
          createdBy: 'user',
        };

        const systemMessage: Message = {
          id: `msg_${Date.now()}_system`,
          contactId: newGroup.id,
          content: `You created group "${name}"`,
          timestamp: new Date(),
          isSent: true,
          status: 'seen',
        };

        set((state) => ({
          contacts: [newGroup, ...state.contacts],
          messages: [...state.messages, systemMessage],
          activeContactId: newGroup.id,
        }));
      },

      updateGroupName: (groupId, name) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === groupId ? { ...c, name } : c
          ),
        }));
      },

      addMemberToGroup: (groupId, memberId) => {
        const memberName = get().contacts.find((c) => c.id === memberId)?.name;

        set((state) => ({
          contacts: state.contacts.map((c) => {
            if (c.id === groupId && c.isGroup) {
              const newMembers = [...(c.members || []), memberId];
              return {
                ...c,
                members: newMembers,
                status: `${newMembers.length + 1} participants`,
              };
            }
            return c;
          }),
        }));

        // Add system message
        const systemMessage: Message = {
          id: `msg_${Date.now()}_system`,
          contactId: groupId,
          content: `You added ${memberName}`,
          timestamp: new Date(),
          isSent: true,
          status: 'seen',
        };

        set((state) => ({
          messages: [...state.messages, systemMessage],
        }));
      },

      removeMemberFromGroup: (groupId, memberId) => {
        const memberName = get().contacts.find((c) => c.id === memberId)?.name;

        set((state) => ({
          contacts: state.contacts.map((c) => {
            if (c.id === groupId && c.isGroup) {
              const newMembers = (c.members || []).filter((id) => id !== memberId);
              return {
                ...c,
                members: newMembers,
                status: `${newMembers.length + 1} participants`,
              };
            }
            return c;
          }),
        }));

        // Add system message
        const systemMessage: Message = {
          id: `msg_${Date.now()}_system`,
          contactId: groupId,
          content: `You removed ${memberName}`,
          timestamp: new Date(),
          isSent: true,
          status: 'seen',
        };

        set((state) => ({
          messages: [...state.messages, systemMessage],
        }));
      },

      leaveGroup: (groupId) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== groupId),
          messages: state.messages.filter((m) => m.contactId !== groupId),
          activeContactId:
            state.activeContactId === groupId ? null : state.activeContactId,
        }));
      },

      deleteGroup: (groupId) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== groupId),
          messages: state.messages.filter((m) => m.contactId !== groupId),
          activeContactId:
            state.activeContactId === groupId ? null : state.activeContactId,
        }));
      },
    }),
    {
      name: 'whatsapp-chats',
    }
  )
);
