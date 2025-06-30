// components/LogoTrigger.tsx
"use client"; // This component needs to be a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

interface LogoTriggerProps {
  children: React.ReactNode; // The element that will be double-clicked (e.g., your logo)
}

export function LogoTrigger({ children }: LogoTriggerProps) {
  const router = useRouter();

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent default browser behavior on double-click (e.g., text selection)
    event.preventDefault();
    console.log("Logo double-clicked! Redirecting to Kinde login...");

    // Directly navigate to the Kinde login endpoint.
    // Kinde will handle the redirect based on your .env configuration (Kinde_AUTH_LOGIN_REDIRECT_URL).
    router.push('/api/auth/login');
  };

  return (
    // This div captures the double-click event
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer select-none" // Apply these styles here
    >
      {children} {/* This will be your visible logo */}
    </div>
  );
}