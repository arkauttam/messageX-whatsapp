import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, LogOut, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const ProfileSidebar = () => {
  const { user, logout, updateStatus } = useAuthStore();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(user?.status || '');
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  const handleSaveStatus = () => {
    updateStatus(newStatus);
    setIsEditingStatus(false);
    toast({
      title: "Status updated",
      description: "Your status has been updated",
    });
  };

  const handleCancelEdit = () => {
    setNewStatus(user.status);
    setIsEditingStatus(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96 p-0">
        <SheetHeader className="bg-header-bg text-header-foreground p-6 pb-4">
          <SheetTitle className="text-header-foreground">Profile</SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">About</label>
            {isEditingStatus ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1"
                  maxLength={100}
                  autoFocus
                />
                <button
                  onClick={handleSaveStatus}
                  className="p-2 text-primary hover:bg-accent rounded-full transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{user.status}</p>
                <button
                  onClick={() => setIsEditingStatus(true)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
