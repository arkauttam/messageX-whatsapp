import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Moon,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Monitor,
} from 'lucide-react';

const SettingItem = ({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors text-left"
  >
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
      <Icon className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      )}
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground" />
  </button>
);

const Settings = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-4 bg-header-bg text-header-foreground">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Profile Section */}
        <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.status}</p>
          </div>
        </div>

        <Separator />

        {/* Settings Items */}
        <div className="py-2">
          <SettingItem
            icon={User}
            title="Account"
            description="Privacy, security, change number"
          />
          <SettingItem
            icon={Bell}
            title="Notifications"
            description="Message, group & call tones"
          />
          <SettingItem
            icon={Lock}
            title="Privacy"
            description="Block contacts, disappearing messages"
          />
        </div>

        <Separator />

        {/* Theme Section */}
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Moon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="font-medium">Theme</p>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                    <Sun className="w-4 h-4" />
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                    <Moon className="w-4 h-4" />
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="w-4 h-4" />
                    System default
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="py-2">
          <SettingItem
            icon={HelpCircle}
            title="Help"
            description="Help center, contact us, privacy policy"
          />
        </div>

        <Separator />

        {/* Logout Button */}
        <div className="p-4">
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>

        {/* App Info */}
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>WhatsApp Clone Demo</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
