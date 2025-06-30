// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // <--- CHANGE THIS LINE (New import)

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user-auth/signup', { // <--- REMEMBER TO UPDATE THIS API PATH!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, mobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Signup Successful!', { // <--- CHANGE THIS LINE
          description: data.message,
        });
        router.push('/onboard');
      } else {
        toast.error('Signup Failed', { // <--- CHANGE THIS LINE
          description: data.message || 'Please try again.',
        });
      }
    } catch (error) {
      console.error('Signup form submission error:', error);
      toast.error('Network Error', { // <--- CHANGE THIS LINE
        description: 'Could not connect to server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component (JSX remains the same)
  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-500/10">
      <Card className="w-full border border-emerald-500 max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Enter your details to create an account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              placeholder="e.g., 9876543210"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button onClick={handleSignup} className="w-full" disabled={loading || !fullName || !mobileNumber}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <Button variant="link" onClick={() => router.push('/login')} className="p-0 h-auto text-emerald-500 hover:text-emerald-600">
              Login
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}