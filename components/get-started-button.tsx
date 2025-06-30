// components/get-started-button.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type * as React from "react";

interface GetStartedButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
  href?: string; // Add an optional href prop
}

export function GetStartedButton({ children, href, ...props }: GetStartedButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // If href is provided, navigate to that href.
    // Otherwise, default to '/signup' (for the original "Get Started" purpose).
    router.push(href || '/signup');
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}