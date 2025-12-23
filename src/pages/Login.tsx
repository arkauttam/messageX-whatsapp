import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both your name and phone number",
        variant: "destructive",
      });
      return;
    }

    if (phone.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    login(name.trim(), phone.trim());
    
    toast({
      title: "Welcome!",
      description: `Logged in as ${name}`,
    });
    
    navigate('/');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-secondary/80 p-4">
      {/* Header decoration */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-secondary" />
      
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-4">
            <MessageCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-semibold text-primary-foreground mb-2">
            MessageX-Whatsapp
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Simple. Secure. Reliable messaging.
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Welcome
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                    maxLength={12}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium gap-2 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-primary-foreground/60 text-xs mt-6">
          Demo app • No real data is stored
        </p>
      </div>
    </div>
  );
};

export default Login;
