import { useCallsStore, Call } from '@/store/callsStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

const formatCallDate = (date: Date) => {
  const d = new Date(date);
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const CallDirectionIcon = ({ direction }: { direction: Call['direction'] }) => {
  switch (direction) {
    case 'incoming':
      return <PhoneIncoming className="w-4 h-4 text-primary" />;
    case 'outgoing':
      return <PhoneOutgoing className="w-4 h-4 text-primary" />;
    case 'missed':
      return <PhoneMissed className="w-4 h-4 text-destructive" />;
  }
};

const CallItem = ({ call }: { call: Call }) => {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
      <Avatar className="w-12 h-12">
        <AvatarImage src={call.contactAvatar} alt={call.contactName} />
        <AvatarFallback className="bg-muted">
          {call.contactName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium truncate",
          call.direction === 'missed' && 'text-destructive'
        )}>
          {call.contactName}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <CallDirectionIcon direction={call.direction} />
          <span>{formatCallDate(new Date(call.timestamp))}</span>
          {call.duration && (
            <>
              <span className="mx-1">•</span>
              <span>{formatDuration(call.duration)}</span>
            </>
          )}
        </div>
      </div>
      
      <Button variant="ghost" size="icon" className="text-primary">
        {call.type === 'video' ? (
          <Video className="w-5 h-5" />
        ) : (
          <Phone className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

const Calls = () => {
  const { calls } = useCallsStore();
  
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4 bg-header-bg text-header-foreground flex items-center justify-between">
        <h1 className="text-xl font-semibold">Calls</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-header-foreground/10">
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Create call link */}
      <div className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Phone className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Create call link</p>
          <p className="text-sm text-muted-foreground">Share a link for your WhatsApp call</p>
        </div>
      </div>
      
      {/* Recent label */}
      <p className="px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Recent
      </p>
      
      {/* Calls list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {calls.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Phone className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No recent calls</p>
          </div>
        ) : (
          calls.map((call) => (
            <CallItem key={call.id} call={call} />
          ))
        )}
      </div>
    </div>
  );
};

export default Calls;
