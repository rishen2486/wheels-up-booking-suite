import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string) => {
    // Basic international phone number validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !telephoneNumber) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(telephoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid international phone number (e.g., +230xxxxxxxx)",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            telephone_number: telephoneNumber,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account",
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill in your details to register for the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password (min 6 characters)"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone Number *</Label>
              <Input
                id="telephone"
                type="tel"
                value={telephoneNumber}
                onChange={(e) => setTelephoneNumber(e.target.value)}
                placeholder="+230 for Mauritius, +33 for France, etc."
                required
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +230 for Mauritius, +33 for France)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              variant="premium"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}