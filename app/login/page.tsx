// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // Using shadcn's Sonner for toasts
import { z } from 'zod'; // Import Zod

// Define a Zod schema for client-side validation
const clientLoginSchema = z.object({
  mobileNumber: z.string()
    .refine(val => /^\d{10}$/.test(val), {
      message: 'Mobile number must be a 10-digit number.',
    }),
});

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ mobileNumber?: string[] }>({}); // State to hold validation errors
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setErrors({}); // Clear previous errors on new submission

    // 1. Client-side validation using Zod
    const validationResult = clientLoginSchema.safeParse({ mobileNumber });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors(fieldErrors); // Set errors to display below input
      toast.error('Validation Error', {
        description: fieldErrors.mobileNumber?.[0] || 'Please correct the input.',
      });
      setLoading(false);
      return; // Stop execution if client-side validation fails
    }

    try {
      // 2. Make the API request
      const response = await fetch('/api/user-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber: validationResult.data.mobileNumber }), // Use validated data
      });

      // 3. Handle the response (crucial for your current error)
      if (!response.ok) {
        // If response.ok is false (e.g., 400, 404, 500 status),
        // try to parse the error message from the server response.
        let errorData;
        try {
          // Attempt to parse JSON even on error status, as our API sends JSON errors
          errorData = await response.json();
        } catch (jsonError) {
          // If parsing fails (e.g., server sent non-JSON or empty body on error)
          console.error("Failed to parse error response JSON:", jsonError);
          toast.error('Login Failed', {
            description: `Server error (Status: ${response.status}). Please try again.`,
          });
          setLoading(false);
          return; // Exit here if JSON parsing failed
        }

        // Display the specific error message from the server or a generic one
        toast.error('Login Failed', {
          description: errorData.message || (errorData.errors ? Object.values(errorData.errors).flat()[0] : 'Please try again.'),
        });
        setLoading(false);
        return; // Stop execution after handling the error response
      }

      // If response.ok is true (e.g., 200 status), parse JSON normally
      const data = await response.json();
      toast.success('Login Successful!', {
        description: data.message,
      });
      router.push('/onboard');

    } catch (error) {
      // This catch block handles network errors (e.g., no internet, DNS issues)
      console.error('Login form submission caught a network error:', error);
      toast.error('Network Error', {
        description: 'Could not connect to server. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-500/10">
      <Card className="w-full max-w-md border border-emerald-500 p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Enter your mobile number to reconnect.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              placeholder="XXXXX-XXXXX"
              type="tel"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setErrors((prev) => ({ ...prev, mobileNumber: undefined })); // Clear error on change
              }}
              disabled={loading}
              className={errors.mobileNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} // Highlight input on error
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.mobileNumber[0]}</p>
            )}
          </div>

          <Button onClick={handleLogin} className="w-full" disabled={loading || !mobileNumber}>
            {loading ? 'Logging In...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don&apos;t have an account?{' '} {/* Changed ' to &apos; */}
            <Button variant="link" onClick={() => router.push('/signup')} className="p-0 h-auto text-emerald-500 hover:text-emerald-600">
              Sign Up
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}