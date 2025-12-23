import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Check, Camera } from 'lucide-react';
import { useChatStore, Contact } from '@/store/chatStore';
import { cn } from '@/lib/utils';

interface CreateGroupDialogProps {
  trigger?: React.ReactNode;
}

export const CreateGroupDialog = ({ trigger }: CreateGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const { contacts, createGroup } = useChatStore();

  // Filter out existing groups
  const availableContacts = contacts.filter((c) => !c.isGroup);

  const handleToggleMember = (contactId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleNext = () => {
    if (selectedMembers.length >= 1) {
      setStep('details');
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length >= 1) {
      createGroup(groupName.trim(), selectedMembers);
      setOpen(false);
      resetState();
    }
  };

  const resetState = () => {
    setStep('select');
    setSelectedMembers([]);
    setGroupName('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Users className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Add group members' : 'New group'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' ? (
          <>
            {/* Selected members chips */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-3 border-b border-border">
                {selectedMembers.map((memberId) => {
                  const contact = contacts.find((c) => c.id === memberId);
                  if (!contact) return null;
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleToggleMember(memberId)}
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {contact.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{contact.name.split(' ')[0]}</span>
                      <span className="text-primary/60">×</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contacts list */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 min-h-[300px]">
              {availableContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
                  onClick={() => handleToggleMember(contact.id)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {selectedMembers.includes(contact.id) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next button */}
            {selectedMembers.length >= 1 && (
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleNext} className="rounded-full px-6">
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Group details */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    <Users className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <Input
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-center text-lg font-medium"
                autoFocus
              />

              <p className="text-sm text-muted-foreground">
                {selectedMembers.length} participant
                {selectedMembers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Members preview */}
            <div className="flex flex-wrap gap-2 justify-center pb-4">
              {selectedMembers.slice(0, 5).map((memberId) => {
                const contact = contacts.find((c) => c.id === memberId);
                if (!contact) return null;
                return (
                  <Avatar key={memberId} className="w-10 h-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="text-xs">
                      {contact.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {selectedMembers.length > 5 && (
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-xs bg-muted">
                    +{selectedMembers.length - 5}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Create button */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className="flex-1"
              >
                Create Group
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
