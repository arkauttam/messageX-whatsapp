import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Bell,
  Star,
  Lock,
  LogOut,
  Trash2,
  MoreVertical,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useChatStore, Contact } from '@/store/chatStore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GroupInfoSheetProps {
  group: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupInfoSheet = ({
  group,
  open,
  onOpenChange,
}: GroupInfoSheetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const {
    contacts,
    updateGroupName,
    addMemberToGroup,
    removeMemberFromGroup,
    leaveGroup,
    deleteGroup,
  } = useChatStore();

  // Get group members
  const members = contacts.filter(
    (c) => group.members?.includes(c.id) && !c.isGroup
  );

  // Get available contacts to add
  const availableContacts = contacts.filter(
    (c) => !c.isGroup && !group.members?.includes(c.id)
  );

  const handleSaveName = () => {
    if (groupName.trim() && groupName !== group.name) {
      updateGroupName(group.id, groupName.trim());
    }
    setIsEditing(false);
  };

  const handleAddMember = (contactId: string) => {
    addMemberToGroup(group.id, contactId);
    setAddMemberOpen(false);
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberFromGroup(group.id, memberId);
  };

  const handleLeaveGroup = () => {
    leaveGroup(group.id);
    onOpenChange(false);
  };

  const handleDeleteGroup = () => {
    deleteGroup(group.id);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Group Info</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Group Avatar & Name */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={group.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                  <Users className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>

              {isEditing ? (
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="text-center"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveName}>
                    <Check className="w-4 h-4 text-primary" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setGroupName(group.name);
                      setIsEditing(false);
                    }}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{group.name}</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Group · {members.length + 1} participants
              </p>
            </div>

            {/* Group options */}
            <div className="space-y-1">
              <button className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Mute notifications</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Starred messages</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    Messages are end-to-end encrypted
                  </p>
                </div>
              </button>
            </div>

            {/* Members section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {members.length + 1} participants
                </p>
              </div>

              {/* Add member button */}
              <button
                onClick={() => setAddMemberOpen(true)}
                className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <p className="font-medium text-primary">Add participant</p>
              </button>

              {/* Current user (admin) */}
              <div className="flex items-center gap-3 p-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    You
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">You</p>
                  <p className="text-sm text-muted-foreground">Group admin</p>
                </div>
              </div>

              {/* Members list */}
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 group"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.status}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Message {member.name}</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove from group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div className="space-y-1 pt-4 border-t border-border">
              <button
                onClick={handleLeaveGroup}
                className="w-full flex items-center gap-4 p-3 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Exit group</span>
              </button>

              <button
                onClick={handleDeleteGroup}
                className="w-full flex items-center gap-4 p-3 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete group</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add member dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add participant</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto -mx-6 px-6">
            {availableContacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No contacts available to add
              </p>
            ) : (
              availableContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors"
                  onClick={() => handleAddMember(contact.id)}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
