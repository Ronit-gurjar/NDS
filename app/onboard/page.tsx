// app/onboard/page.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as QRCode from 'qrcode.react';
import { GetStartedButton } from '@/components/get-started-button';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ClientOnboardPage() {
  // Ensure this environment variable is prefixed with NEXT_PUBLIC_ for client-side access
  const whatsappNumber = process.env.NEXT_PUBLIC_BUSINESS_NO; 

  const [userFullName, setUserFullName] = useState('');
  const [userMobileNumber, setUserMobileNumber] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    // --- DEBUGGING TIP: Check your browser's console for these logs! ---

    // Read user data from cookies when the component mounts
    const storedFullName = Cookies.get('userFullName');
    const storedMobileNumber = Cookies.get('userMobileNumber');

    // Ensure these cookies are actually being set correctly during login/signup.

    // Set state to empty string if not found, handle display fallback in JSX where needed
    setUserFullName(storedFullName || ''); 
    setUserMobileNumber(storedMobileNumber || '');

    // Use actual cookie values if available, otherwise fall back to placeholders for the text
    const nameForText = storedFullName || '[YOUR_FULL_NAME_HERE]';
    const mobileForText = storedMobileNumber || '[YOUR_MOBILE_NUMBER_HERE]';

    // Dynamically create the pre-populated text
    const dynamicPrepopulatedText =
      `Hello! I've just signed up on your platform and would like to connect for onboarding. ` +
      `My full name is ${nameForText} and my mobile number is ${mobileForText}.`;

    // Create the WhatsApp link
    const generatedWhatsappLink = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(dynamicPrepopulatedText)}`
      : `https://wa.me/?text=${encodeURIComponent(dynamicPrepopulatedText)}`;

    setWhatsappLink(generatedWhatsappLink);

  }, []); // Reverted to empty dependency array to run once on mount and read cookies

  // Get first name for display in the title, defaulting to 'there' for a friendly greeting
  const displayFirstName = userFullName.split(' ')[0] || 'there';

  // Render a loading state if whatsappLink isn't ready or whatsappNumber is missing on client
  if (!whatsappLink || (typeof window !== 'undefined' && !whatsappNumber)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-500/10 text-white">
        Loading onboarding details...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-500/10 p-4">
      <Card className="w-full border border-emerald-500 max-w-3xl p-6 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-4">
            Welcome Onboard, {displayFirstName}!
          </CardTitle>
          <CardDescription className="text-center text-gray-300 mb-6">
            Thank yourself for taking the first step! Please connect with us on WhatsApp using the options below. Our team will reach out to you as soon as possible.
          </CardDescription>
        </CardHeader>
        {/* Adjusted grid to use 1fr_auto_1fr for better column distribution */}
        <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-start">
          {/* First Part: WhatsApp Button */}
          <div className="flex flex-col items-center px-4 py-0"> {/* Removed p-4, added specific px-4 py-0 */}
            <CardHeader className="w-full">
              <CardTitle className="text-xl font-semibold text-center">Next Step:</CardTitle> {/* Added text-center */}
            </CardHeader>
            <CardContent className="space-y-4 w-full">
              <CardDescription className="text-center"> {/* Added text-center */}
                Click on the button below and join us on WhatsApp. Our team will reach out to you as soon as possible.
              </CardDescription>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Join on WhatsApp
                </a>
              </Button>
            </CardContent>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center h-full min-h-[150px]">
            <Separator orientation="vertical" className="h-full mx-auto hidden md:block bg-gray-700" />
            <div className="absolute inset-x-0 h-[1px] bg-gray-700 md:hidden my-4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-gray-500 hidden md:block rounded">OR</div>
          </div>

          {/* Second Part: QR Code */}
          <div className="flex flex-col justify-center items-center px-4 py-0"> {/* Removed p-4, added specific px-4 py-0 */}
            <CardHeader className="w-full">
              <CardTitle className="text-xl font-semibold text-center">Or continue on mobile:</CardTitle> {/* Added text-center */}
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-4 w-full">
              <CardDescription className="text-center"> {/* Added text-center */}
                Scan this QR code to open the same WhatsApp chat.
              </CardDescription>
              <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                <QRCode.QRCodeCanvas value={whatsappLink} size={200} level="H" />
              </div>
            </CardContent>
          </div>
        </CardContent>

        {/* Done button section moved to CardFooter */}
        <CardFooter className="mt-8 pt-6 border-t border-gray-700 flex justify-center">
          <GetStartedButton
            href="/"
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full px-8 py-4 text-xl transition-colors duration-200"
            size="lg"
          >
            Done
          </GetStartedButton>
        </CardFooter>
      </Card>
    </div>
  );
}