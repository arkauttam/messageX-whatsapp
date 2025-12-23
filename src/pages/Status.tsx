import { useState } from 'react';
import { useStatusStore, UserStatus } from '@/store/statusStore';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const StatusRing = ({ 
  statuses, 
  viewed, 
  size = 'default' 
}: { 
  statuses: number; 
  viewed: boolean; 
  size?: 'default' | 'large';
}) => {
  const circumference = 2 * Math.PI * 23;
  const segmentLength = circumference / statuses;
  const gapLength = statuses > 1 ? 4 : 0;
  
  const sizeClass = size === 'large' ? 'w-16 h-16' : 'w-14 h-14';
  
  return (
    <svg className={cn("absolute -inset-1", sizeClass)} viewBox="0 0 52 52">
      {Array.from({ length: statuses }).map((_, i) => (
        <circle
          key={i}
          cx="26"
          cy="26"
          r="23"
          fill="none"
          strokeWidth="2.5"
          className={viewed ? 'stroke-muted-foreground/40' : 'stroke-primary'}
          strokeDasharray={`${segmentLength - gapLength} ${gapLength}`}
          strokeDashoffset={-i * segmentLength + circumference / 4}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

const StatusItem = ({ 
  userStatus, 
  onClick 
}: { 
  userStatus: UserStatus;
  onClick: () => void;
}) => {
  const allViewed = userStatus.statuses.every(s => s.viewed);
  const latestStatus = userStatus.statuses[userStatus.statuses.length - 1];
  
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="relative">
        <StatusRing statuses={userStatus.statuses.length} viewed={allViewed} />
        <Avatar className="w-12 h-12">
          <AvatarImage src={userStatus.avatar} alt={userStatus.userName} />
          <AvatarFallback className="bg-muted text-sm">
            {userStatus.userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium truncate">{userStatus.userName}</p>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(latestStatus.timestamp), { addSuffix: true })}
        </p>
      </div>
    </button>
  );
};

const Status = () => {
  const { user } = useAuthStore();
  const { statuses, viewStatus } = useStatusStore();
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  
  const recentUpdates = statuses.filter(s => !s.isMine && s.statuses.some(st => !st.viewed));
  const viewedUpdates = statuses.filter(s => !s.isMine && s.statuses.every(st => st.viewed));
  
  const handleViewStatus = (userStatus: UserStatus) => {
    setSelectedStatus(userStatus);
    setCurrentStatusIndex(0);
    // Mark first as viewed
    if (userStatus.statuses[0]) {
      viewStatus(userStatus.userId, userStatus.statuses[0].id);
    }
  };
  
  const handleNextStatus = () => {
    if (!selectedStatus) return;
    
    if (currentStatusIndex < selectedStatus.statuses.length - 1) {
      const nextIndex = currentStatusIndex + 1;
      setCurrentStatusIndex(nextIndex);
      viewStatus(selectedStatus.userId, selectedStatus.statuses[nextIndex].id);
    } else {
      setSelectedStatus(null);
      setCurrentStatusIndex(0);
    }
  };
  
  const handlePrevStatus = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4 bg-header-bg text-header-foreground">
        <h1 className="text-xl font-semibold">Status</h1>
      </div>
      
      {/* My Status */}
      <div className="border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <div className="relative">
            <Avatar className="w-14 h-14">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium">My Status</p>
            <p className="text-sm text-muted-foreground">Tap to add status update</p>
          </div>
          <Button variant="ghost" size="icon" className="text-primary">
            <Camera className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className="mt-2">
          <p className="px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent updates
          </p>
          {recentUpdates.map((userStatus) => (
            <StatusItem
              key={userStatus.userId}
              userStatus={userStatus}
              onClick={() => handleViewStatus(userStatus)}
            />
          ))}
        </div>
      )}
      
      {/* Viewed Updates */}
      {viewedUpdates.length > 0 && (
        <div className="mt-4">
          <p className="px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Viewed updates
          </p>
          {viewedUpdates.map((userStatus) => (
            <StatusItem
              key={userStatus.userId}
              userStatus={userStatus}
              onClick={() => handleViewStatus(userStatus)}
            />
          ))}
        </div>
      )}
      
      {/* Status Viewer Dialog */}
      <Dialog open={!!selectedStatus} onOpenChange={() => setSelectedStatus(null)}>
        <DialogContent className="max-w-md p-0 bg-black border-0 overflow-hidden">
          {selectedStatus && (
            <div className="relative aspect-[9/16] w-full">
              {/* Progress bars */}
              <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                {selectedStatus.statuses.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-all",
                      i <= currentStatusIndex ? 'bg-white' : 'bg-white/30'
                    )}
                  />
                ))}
              </div>
              
              {/* Header */}
              <div className="absolute top-6 left-2 right-2 flex items-center gap-3 z-10">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={selectedStatus.avatar} />
                  <AvatarFallback>{selectedStatus.userName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{selectedStatus.userName}</p>
                  <p className="text-white/70 text-xs">
                    {formatDistanceToNow(new Date(selectedStatus.statuses[currentStatusIndex].timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              {/* Image */}
              <img
                src={selectedStatus.statuses[currentStatusIndex].imageUrl}
                alt="Status"
                className="w-full h-full object-cover"
              />
              
              {/* Touch zones */}
              <button
                className="absolute left-0 top-0 bottom-0 w-1/3"
                onClick={handlePrevStatus}
              />
              <button
                className="absolute right-0 top-0 bottom-0 w-2/3"
                onClick={handleNextStatus}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Status;
